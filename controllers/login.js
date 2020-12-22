const handleLogin = async (req, res, next, postgresDB, bcrypt ) => {
    const { email, password, } =  req.body;
    if(!email || !password) {
        return res.status(400).json("unable to login");
    }

    let hashedPassword;
    try {
        hashedPassword = bcrypt.hashSync(password, 14);
    } catch(err) {
        return res.status(400).json("cannot login due to issue with password")
    }

    const user = await postgresDB.select("*").from("user_").where("email", "=", email)
    .then(res => res.json()[0])
    .catch(err => res.status(400).json("unable to login"))

    const storedHashedPassword = await postgresDB.select("password_hash").from("auth").where("user_id", "=", user.user_id)
    .then(res => res.json[0].password_hash)
    .catch(err => res.status(400).json("unable to login"))

    const verifyPassword = await bcrypt.compareSync(hashedPassword, storedHashedPassword);
    
    if(verifyPassword) {
        return res.send(JSON.stringify(user));
    } 
    if(!verifyPassword) {
        res.status(400).json("unable to login")
    }

}

module.exports = {
    handleLogin
}