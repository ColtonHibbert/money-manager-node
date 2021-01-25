
const handlePasswordReset =(async (req, res, next, postgresDB, bcrypt, nodemailer) => {
    const { password, confirmPassword, token} = req.body;

    if(!password || !confirmPassword || !token) {
        return res.status(400).json({ error: "Please fill in missing fields."})
    }

    if(password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords must match."})
    }

    const auth = await postgresDB.select("auth_id", "user_id", "reset_token","token_expires").from("auth").where("reset_token", "=", token)
    .then(data => {
        if(data[0]) {
            return data[0];
        }
    })
    .catch(err => res.status(400).json({error: "Your information is not valid. Please try to log in again."}));
    if(auth === undefined) {
        return res.status(400).json({error: "Your information is not valid. Please try to log in again."});
    }


    const tokenExpiresToMilliseconds = Date.parse(auth.token_expires);
    console.log("passwordReset, tokenExpiresToMilliseconds: ", tokenExpiresToMilliseconds);
    console.log("passwordReset, Date.now(): ", Date.now());
    if(Date.now() > tokenExpiresToMilliseconds) {
        return res.status(400).json({error: "Your password reset link has expired. Please try again."})
    }
   
    let hashedPassword;
    try {
         hashedPassword = bcrypt.hashSync(password, 14);
    } catch(err) {
        return res.status(400).json({error: "Your password must be less than 72 characters."});
    }

    const changeAuthPasswordAndExpireToken = await postgresDB.transaction(trx => {
        trx("auth").where("auth_id", "=", auth.auth_id).update({ reset_token: null, token_expires: null, hashed_password: hashedPassword })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        return res.status(400).json({error: "There was an error resetting your password."})
    })

    const user = await postgresDB.select("*").from("user_").where("user_id", "=", auth.user_id)
    .then(data => {
        if(data[0]) {
            return data[0];
        }
    })
    .catch(err => res.status(400).json({error: "There was an error retrieving your information."}));
    if(user === undefined) {
        return res.status(400).json({error: "There was an error retrieving your information."});
    }
    console.log("passwordReset, user: ", user); 

    req.session.regenerate(async function(err) {
        console.log("passwordReset, session id, after regenerate: ", req.session.id);
        console.log("passwordReset, user id, after regenerate, before adding to session: ", req.session.userId);
        console.log("passwordReset, req.csrfToken(), after regenerate, before adding to session, should be automatic: ", req.csrfToken());
           
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
                    error: "There was an issue resetting your password."
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

            console.log("passwordReset, user id, after regenerate, after adding to session: ", req.session.userId);
            console.log("passwordReset, req.csrfToken(), after regenerate, haven't explicitly added to session, should be automatic: ", req.csrfToken());
            console.log("passwordReset, entire session, after regenerate and adding to session: ", req.session)

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: `${process.env.RESET_EMAIL}`,
                    pass: `${process.env.RESET_PASSWORD}`
                }
            });
        
            const mailOptions = {
                from: "moneymanagerdemoreset@gmail.com",
                to: `${user.email}`,
                subject: "Money Manager Password Reset Successful",
                text: 
                "You are receiving this verification that your password reset has been successful.\n\n" 
            }

            transporter.sendMail(mailOptions, (err, response) => {
                if(err) {
                    console.log("There was an error sending email in passwordResetHandler.");
                }
            })

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
    handlePasswordReset
}