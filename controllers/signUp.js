const signUp = (req, res, next, postgresDB, bcrypt) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.json("invalid sign up");
    }

    const hashedPassword = bcrypt.hashSync(password, 14);

    postgresDB.transaction( (trx) => {
        trx.insert()
        .then(trx.commit)
        .catch(trx.rollback)
    } )
    .catch(err => res.status(400).json("unable to sign up"))


}