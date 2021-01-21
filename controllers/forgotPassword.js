
const handleForgotPassword = (async (req, res, next, postgresDB, nodemailer ) => {
    console.log("handleForgotPassword, email", req.body.email);
    const { email } = req.body;

    if(email === "") {
        return res.status(400).json({error: "Please enter an email"});
    }

    const DBUser = await postgresDB.select("email", "user_id").from("user_").where("email", "=", email)
    .then(data => {
        console.log("handleForgotPassword, db email data", data);
        if(data[0]) {
            return data[0]
        }
    })
    .catch(err => {
        return res.status(400).json({error: "This email is not found. Please enter a valid email."})
    })
    if(DBUser === undefined) {
        return res.status(400).json({error: "This email is not found. Please enter a valid email."})
    }

    if(DBUser !== undefined) {

        const token = crypto.randomBytes(20).toString("hex");
        
        await postgresDB.transaction(trx => {
            trx.insert({
                reset_token: token,
                token_expires: Date.now() + (60000 * 30)
            })
            .into("auth")
            .where("user_id", "=", DBUser.user_id)
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            return res.status(400).json({error: "Server error. Unable to send reset link."})
        })



    }

})

module.exports = {
    handleForgotPassword
}