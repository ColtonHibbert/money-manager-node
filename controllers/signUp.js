
const handleSignUp = (async (req, res, next, postgresDB, bcrypt) => {

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

    let user;
    await postgresDB.transaction(async (trx) => {

        user = await trx.insert({
            email: email
        })
        .returning("*")
        .into("user_")
        user = user[0];
        
        await trx.insert({
            password_hash: hashedPassword,
            user_id: user.user_id
        })
        .into("auth")
        .then(trx.commit)
        .catch(trx.rollback)

    })
    .catch(err => res.status(400).json("error with signup"))

    req.session.regenerate(async function(err) {
        console.log(req.session.id, "session id log inside signup regen");
            //reset session, prevent session fixation
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
                res.status(400).json("unable to log in, server error");
            })
    
            req.session.userId = user.user_id;
            req.session.firstName = user.first_name;
            req.session.lastName = user.last_name;
            req.session.email = user.email;
            req.session.address = user.address;
            req.session.phone = user.phone;
            req.session.about = user.about;
            req.session.joined = user.joined;
            req.session.householdMemberId = user.household_member_id;
            req.session.householdId = user.household_id;
            req.session.roleId = user.role_id;
    
            return res.send(JSON.stringify(user));
    })
    
    return res.json("sign up inserted");

})

module.exports = {
    handleSignUp
}