// check token, grab user via token! , use that to make session
const handlePasswordReset =(async (req, res, next, postgresDB, bcrypt) => {
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

    
    


})

module.exports = {
    handlePasswordReset
}