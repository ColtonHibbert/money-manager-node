
const handleForgotPassword = (async (req, res, next, postgresDB, nodemailer, crypto ) => {
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
        
        const time = new Date(Date.now() + (60000 * 30)).toISOString();
        
        await postgresDB.transaction(trx => {
            trx.insert({
                reset_token: token,
                token_expires: time
            })
            .into("auth")
            .where("user_id", "=", DBUser.user_id)
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            return res.status(400).json({error: "Server error. Unable to send reset link."})
        })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.RESET_EMAIL}`,
                pass: `${process.env.RESET_PASSWORD}`
            }
        });

        const mailOptions = {
            from: "moneymanagerdemoreset@gmail.com",
            to: `${DBUser.email}`,
            subject: "Money Manager Password Reset Link",
            text: 
            "You are receiving this because you (or someone else) have requested the reset of the password on your account.\n\n" 
            + "Please click on the link below or paste it the url bar in your browser and complete the password reset process.\n\n"
            + "This link will expire in 15 minutes."
            + `http://localhost:3000/?token=${token}` + "\n\n"
            + "If you do not wish to change your password then do not click on the link and your password will remain unchanged."
        }

        console.log("handleForgotPassword, before send password");

        transporter.sendMail(mailOptions, (err, response) => {
            if(err) {
                console.log("There was an error sending email in forgotPasswordHandler.");
                return res.status(400).json({ error: "There was an error sending to the specified email address."})
            } else {
                return res.status(200).json({emailSent: "success"})
            }
        })

    }

})

module.exports = {
    handleForgotPassword
}