const signUp = (req, res, next, postgresDB, bcrypt) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.json("invalid sign up");
    }

    const hashedPassword = bcrypt.hashSync(password, 14);
}