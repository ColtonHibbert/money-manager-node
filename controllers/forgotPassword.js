
const handleForgotPassword = (async (req, res, next, postgresDB ) => {
    console.log("handleForgotPassword, email", req.body.email);
    const { email } = req.body;

    if(email === "") {
        return res.status(400).json({error: "Please enter an email"});
    }

    const validEmail = await postgresDB.select("email").from("user_").where("email", "=", email)
    .then(data => {
        if(data[0]) {
            return data[0]
        }
    })
    .catch(err => {
        return res.status(400).json({error: "This email is not found."})
    })
    if(validEmail === undefined) {
        return res.status(400).json({error: "This email is not found."})
    }

})

module.exports = {
    handleForgotPassword
}