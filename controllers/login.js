const handleLogin = (req, res, next, postgresDB, bcrypt ) => {
    const { email, password, } =  req.body;
    if(!email || !password) {
        return res.json("unable to login");
    }

    

}

module.exports = {
    handleLogin
}