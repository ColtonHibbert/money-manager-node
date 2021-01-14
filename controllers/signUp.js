
const handleSignUp = (async (req, res, next, postgresDB, bcrypt) => {
    console.log("handleSignUp, session id, before regenerate: ", req.session.id);
    console.log("handleSignUp, user id, before regenerate: ", req.session.userId);
    console.log("handleSignUp, req.csrfToken(), before regenerate: ", req.csrfToken());

    const { email, password, firstName, lastName } = req.body;

    if(!email || !password || !firstName || !lastName ) {
        const missingEmailOrPasswordOrName = {
            error: "MISSING_EMAIL_OR_PASSWORD_OR_NAME"
        }
        return res.status(400).json(missingEmailOrPasswordOrName);
    }

    let hashedPassword;
    try {
         hashedPassword = bcrypt.hashSync(password, 14);
    } catch(err) {
        const invalidPassword = {
            error: "INVALID_PASSWORD"
        }
        return res.status(400).json(invalidPassword);
    }

    const checkEmailError = {
        error: "EMAIL_TAKEN"
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
   
    let user;
    await postgresDB.transaction(async (trx) => {

        user = await trx.insert({
            email: email,
            first_name: firstName,
            last_name: lastName,
            role_id: 1
        })
        .returning("*")
        .into("user_")
        .catch(trx.rollback)
        user = user[0];
        
        await trx.insert({
            password_hash: hashedPassword,
            user_id: user.user_id
        })
        .into("auth")
        .then(trx.commit)
        .catch(trx.rollback)

    })
    .catch(err => {
        const signUpError = {
            error: "SIGN_UP_ERROR"
        }
        return res.status(400).json(signUpError);
    })

    
    req.session.regenerate(async function(err) {
        console.log("handleSignUp, session id, after regenerate: ", req.session.id);
        console.log("handleSignUp, user id, after regenerate, before adding to session: ", req.session.userId);
        console.log("handleSignUp, req.csrfToken(), after regenerate, before adding to session, should be automatic: ", req.csrfToken());

            //reset session, prevent session fixation
            await postgresDB.transaction( (trx) => {
                trx.insert({ 
                    session: req.session.id,
                    user_id: user.user_id
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
    
            req.session.userId = user.user_id;
            req.session.firstName = user.first_name;
            req.session.lastName = user.last_name;
            req.session.email = user.email;
            req.session.address = user.address;
            req.session.phone = user.phone;
            req.session.about = user.about;
            req.session.joined = user.joined;
            req.session.householdMemberId = user.household_member_id;
            req.session.householdId = user.household_id;
            req.session.roleId = user.role_id;

            console.log("handleSignUp, user id, after regenerate, after adding to session: ", req.session.userId);
            console.log("handleSignUp, req.csrfToken(), after regenerate, haven't explicitly added to session, should be automatic: ", req.csrfToken());
            console.log("handleSignUp, entire session, after regenerate and adding to session: ", req.session)

            const userResponse = {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                about: user.about,
                joined: user.joined,
                householdMemberId: user.household_member_id,
                householdId: user.household_id,
                roleId: user.role_id,
                csrf: req.csrfToken()
            }
    
            return res.send(JSON.stringify(userResponse));
    })

})

module.exports = {
    handleSignUp
}