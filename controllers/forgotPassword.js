
const handleForgotPassword = (async (req, res, next, postgresDB ) => {
    console.log("handleForgotPassword, email", req.body.email);
    const { email } = req.body;

    if(email === "") {
        return res.status(400).json({error: "Please enter an email"});
    }

    const DBEmail = await postgresDB.select("email").from("user_").where("email", "=", email)
    .then(data => {
        console.log("handleForgotPassword, db email data", data);
        if(data[0]) {
            return data[0]
        }
    })
    .catch(err => {
        return res.status(400).json({error: "This email is not found. Please enter a valid email."})
    })
    if(DBEmail === undefined) {
        return res.status(400).json({error: "This email is not found. Please enter a valid email."})
    }

    if(DBEmail !== undefined) {
        const token = crypto.randomBytes(20).toString("hex");
        

    }

})

module.exports = {
    handleForgotPassword
}