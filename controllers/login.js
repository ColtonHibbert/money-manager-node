const handleLogin = async (req, res, next, postgresDB, bcrypt ) => {
    const { email, password, } =  req.body;
    if(!email || !password) {
        return res.status(400).json("unable to login");
    }

    let hashedPassword;
    try {
        hashedPassword = bcrypt.hashSync(password, 14);
    } catch(err) {
        console.log("error with password on login");
    }

    const user = await postgresDB.select("*").from("user_")

    const storedHashedPassword = await postgresDB.select("*").from

    const verifyPassword = bcrypt.compareSync(hashedPassword, storedHashedPassword);
    

}

module.exports = {
    handleLogin
}