
const handleSignUp = (async (req, res, next, postgresDB, bcrypt) => {
    console.log("handleSignUp, session id, before regenerate: ", req.session.id);
    console.log("handleSignUp, user id, before regenerate: ", req.session.userId);
    console.log("handleSignUp, req.csrfToken(), before regenerate: ", req.csrfToken());

    const { email, password, firstName, lastName, rememberMe } = req.body;

    if(!email || !password || !firstName || !lastName ) {
        const missingEmailOrPasswordOrName = {
            error: "Please fill in missing fields."
        }
        return res.status(400).json(missingEmailOrPasswordOrName);
    }

    let hashedPassword;
    try {
         hashedPassword = bcrypt.hashSync(password, 14);
    } catch(err) {
        const invalidPassword = {
            error: "Invalid password."
        }
        return res.status(400).json(invalidPassword);
    }

    const checkEmailError = {
        error: "Email is already in use."
    }
    const checkEmail = await postgresDB.select("email").from("user_").where("email", "=", email)
        .then(data => {
            console.log(email)
            console.log(data)
            if(data[0]) {
               return res.status(400).json(checkEmailError);
            }
        })
        .catch(err => {
            console.log(err, "error in catch, checkEmail")
            return res.status(400).json(checkEmailError);
        })
   
    let userDB;
    await postgresDB.transaction(async (trx) => {

        userDB = await trx.insert({
            email: email,
            first_name: firstName,
            last_name: lastName,
            role_id: 1
        })
        .returning("*")
        .into("user_")
        .catch(trx.rollback)
        userDB = userDB[0];
        
        await trx.insert({
            password_hash: hashedPassword,
            user_id: userDB.user_id
        })
        .into("auth")
        .then(trx.commit)
        .catch(trx.rollback)

    })
    .catch(err => {
        const signUpError = {
            error: "Error signing up. Please try again."
        }
        return res.status(400).json(signUpError);
    })

    
    req.session.regenerate(async function(err) {
        console.log("handleSignUp, session id, after regenerate: ", req.session.id);
        console.log("handleSignUp, user id, after regenerate, before adding to session: ", req.session.userId);
        console.log("handleSignUp, req.csrfToken(), after regenerate, before adding to session, should be automatic: ", req.csrfToken());
        console.log("handleLogin, rememberMe, after regenerate, before adding to session: ", rememberMe);
            if(rememberMe === false) {
                req.session.cookie.expires = false;
            }
            //reset session, prevent session fixation
            await postgresDB.transaction( (trx) => {
                trx.insert({ 
                    session: req.session.id,
                    user_id: userDB.user_id
                })
                .into("session")
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .catch( (err) => {
                return res.status(400).json({
                    error: "SIGN_UP_ERROR"
                });
            })
    
            req.session.userId = userDB.user_id;
            req.session.firstName = userDB.first_name;
            req.session.lastName = userDB.last_name;
            req.session.email = userDB.email;
            req.session.address = userDB.address;
            req.session.phone = userDB.phone;
            req.session.about = userDB.about;
            req.session.joined = userDB.joined;
            req.session.householdMemberId = userDB.household_member_id;
            req.session.householdId = userDB.household_id;
            req.session.roleId = userDB.role_id;

            console.log("handleSignUp, user id, after regenerate, after adding to session: ", req.session.userId);
            console.log("handleSignUp, req.csrfToken(), after regenerate, haven't explicitly added to session, should be automatic: ", req.csrfToken());
            console.log("handleSignUp, entire session, after regenerate and adding to session: ", req.session)

            const user = {
                userId: userDB.user_id,
                firstName: userDB.first_name,
                lastName: userDB.last_name,
                email: userDB.email,
                address: userDB.address,
                phone: userDB.phone,
                about: userDB.about,
                joined: userDB.joined,
                householdMemberId: userDB.household_member_id,
                householdId: userDB.household_id,
                roleId: userDB.role_id,
                csrf: req.csrfToken()
            }

            const accountsInDB = await postgresDB.select("*").from("account").where("user_id", "=", user.userId)
            .then(data => {
                console.log("loadInitialData, accountsInDB: ", data);
                return data
            })
            .catch(err => res.status(400).json({error: "There was an error loading your data."}))

            const formatAccounts = (accountsInDB) => {
                let accountsArray = [];
                for(let i = 0; i < accountsInDB.length; i++) {
                    let account = {
                        accountId: accountsInDB[i].account_id,
                        accountName: accountsInDB[i].account_name,
                        currentBalance: accountsInDB[i].current_balance,
                        lowAlertBalance: accountsInDB[i].low_alert_balance,
                        userId: accountsInDB[i].user_id,
                        accountTypeId: accountsInDB[i].account_type_id
                    }
                    accountsArray.push(account);
                }
                return accountsArray;
            }
            const accounts = formatAccounts(accountsInDB);

            const initialData = {
                user: user,
                accounts: accounts
            }

            return res.send(JSON.stringify({initialData}));
    
    })

})

module.exports = {
    handleSignUp
}