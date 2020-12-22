const signUp = (req, res, next, postgresDB, bcrypt) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json("missing email or password");
    }

    let hashedPassword;
    try {
         hashedPassword = bcrypt.hashSync(password, 14);
    } catch(err) {
        return res.status(400).json("the password is invalid or has too many characters");
    }
    

    postgresDB.transaction( (trx) => {
        trx.postgresDB.transaction(async (trx) => {
            const user = await trx.insert({
                email: email
            })
            .returning("*")
            .into("user_")

            await trx.insert({
                password_hash: hashedPassword,
                user_id: user[0].user_id
            })
            .into("auth")
            
        }).then(trx.commit)
        .catch(trx.rollback)
    } )
    .catch(err => res.status(400).json("unable to sign up"))

    return res.json("sign up inserted");

}