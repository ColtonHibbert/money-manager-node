
const handleLogin = async (req, res, next, postgresDB, bcrypt ) => {

    const { email, password } =  req.body;
    if(!email || !password) {
        return res.status(400).json("unable to login, missing email or password");
    }

    const user = await postgresDB.select("*").from("user_").where("email", "=", email)
    .then(data => data[0])
    .catch(err => res.status(400).json("unable to login, issue with username or password"))

    const storedHashedPassword = await postgresDB.select("password_hash").from("auth").where("user_id", "=", user.user_id)
    .then(data => data[0].password_hash)
    .catch( (err) => res.status(400).json("unable to login, issue with username or password"))

    const verifyPassword = await bcrypt.compareSync(password, storedHashedPassword);
    
    if(verifyPassword) {
        //req.session.userId = user.user_id;
        console.log(req.session);
        console.log(req.session.id);
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
            res.redirect("/login");
        })
        return res.send(JSON.stringify(user));
    } 
    if(!verifyPassword) {
        res.status(400).json("unable to login")
    }

}

module.exports = {
    handleLogin
}