
const handleSignUp = (async (req, res, next, postgresDB, bcrypt) => {

    const { email, password, firstName, lastName } = req.body;

    if(!email || !password || !firstName || !lastName ) {
        const missingEmailOrPassword = {
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

    const checkEmail = await postgresDB.transaction(async (trx) => {
        trx.select("email").from("user_").where("email", "=", email)
        .catch(err => {
            const checkEmailError = {
                error: "EMAIL_TAKEN"
            }
            console.log("checkEmail error", err);
            res.status(400).json(checkEmailError)
        })
    })

    let user;
    await postgresDB.transaction(async (trx) => {

        user = await trx.insert({
            email: email,
            first_name: firstName,
            last_name: lastName
        })
        .returning("*")
        .into("user_")
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
        res.status(400).json(signUpError);
    })

    req.session.regenerate(async function(err) {
        console.log(req.session.id, "session id log inside signup regen");
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
                res.status(400).json({
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
                roleId: user.role_id
            }
    
            return res.send(JSON.stringify(userResponse));
    })

})

module.exports = {
    handleSignUp
}