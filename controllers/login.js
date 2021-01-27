
const handleLogin = (async (req, res, next, postgresDB, bcrypt ) => {

    console.log("handleLogin, session.id, before regenerate: ", req.session.id);
    console.log("handleLogin, userId, before regenerate: ", req.session.userId);
    console.log("handleLogin, req.csrfToken, before regenerate", req.csrfToken());

    const missingEmailOrPassword = {
        error: "Missing Email Or Password."
    }

    const invalidEmailOrPassword = {
        error: "Invalid Email or Password."
    }

    const serverError = {
        error: "Server Error."
    }

    const unableToLogin = {
        error: "Unable to login."
    }

    const { email, password, rememberMe } =  req.body;
    if(!email || !password) {
        return res.status(400).json(missingEmailOrPassword);
    }

    const userDB = await postgresDB.select("*").from("user_").where("email", "=", email)
    .then(data => {
        if(data[0]) {
            return data[0];
        }
    })
    .catch(err => res.status(400).json(invalidEmailOrPassword));
    if(userDB === undefined) {
        return res.status(400).json(invalidEmailOrPassword);
    }
    console.log("loginHandler, userDB: ", userDB);

    const storedHashedPassword = await postgresDB.select("password_hash").from("auth").where("user_id", "=", userDB.user_id)
    .then(data => {
        if(data[0]) {
            return data[0].password_hash;
        }
    })
    .catch( (err) => res.status(400).json(invalidEmailOrPassword))
    if(storedHashedPassword === undefined) {
        return res.status(400).json(invalidEmailOrPassword);
    }
    

    const verifyPassword = await bcrypt.compareSync(password, storedHashedPassword);
    
    if(verifyPassword) {
        req.session.regenerate(async function (err) {
            console.log("handleLogin, session id, after regenerate: ", req.session.id );
            console.log("handleLogin, user id, after regenerate, before adding to session: ", req.session.userId);
            console.log("handleLogin, csrfToken(), after regenerate, before adding to session: ", req.csrfToken());
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
                return res.status(400).json(serverError);
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

            console.log("hanldeLogin, user id, after regenerate, after adding to session: ", req.session.userId);
            console.log("handleLogin, req.csrfToken, after regenerate, haven't explicitly added to session, should be automatic", req.csrfToken());
            console.log("handleLogin, entire session, after regenerate and adding to session: ", req.session);

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
    
        });
    } 
    if(!verifyPassword) {
        return res.status(400).json(unableToLogin);
    }
});

module.exports = {
    handleLogin
}