
const handleLogin = (async (req, res, next, postgresDB, bcrypt ) => {

    //handle Error with invalid email and password
    console.log("handleLogin session.id", req.session.id);
    console.log("handleLogin userId", req.session.userId);

    const missingEmailOrPassword = {
        error: "Missing Email Or Password."
    }

    const invalidEmailOrPassword = {
        error: "Invalid Email or Password."
    }

    const serverError = {
        error: "Server Error."
    }

    const unableToLogin = {
        error: "Unable to login."
    }

    const { email, password } =  req.body;
    if(!email || !password) {
        return res.status(400).json(missingEmailOrPassword);
    }

    const user = await postgresDB.select("*").from("user_").where("email", "=", email)
    .then(data => {
        if(data[0]) {
            return data[0];
        }
    })
    .catch(err => res.status(400).json(invalidEmailOrPassword));
    if(user === undefined) {
        return res.status(400).json(invalidEmailOrPassword);
    }
    console.log("after check user", user);

    const storedHashedPassword = await postgresDB.select("password_hash").from("auth").where("user_id", "=", user.user_id)
    .then(data => {
        if(data[0]) {
            return data[0].password_hash;
        }
    })
    .catch( (err) => res.status(400).json(invalidEmailOrPassword))
    if(storedHashedPassword === undefined) {
        return res.status(400).json(invalidEmailOrPassword);
    }
    

    const verifyPassword = await bcrypt.compareSync(password, storedHashedPassword);
    
    if(verifyPassword) {
        console.log(req.session.id, '1st session id log');
        req.session.regenerate(async function (err) {
            console.log(req.session.id, "session id log inside regen");
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
                return res.status(400).json(serverError);
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

            const userResponse = {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                about: user.about,
                joined: user.joined,
                householdMemberId: user.household_member_id,
                householdId: user.household_id,
                roleId: user.role_id
            }
    
            return res.send(JSON.stringify(userResponse));
        });
    } 
    if(!verifyPassword) {
        return res.status(400).json(unableToLogin);
    }
});

module.exports = {
    handleLogin
}