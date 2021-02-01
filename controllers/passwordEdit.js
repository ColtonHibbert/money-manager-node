const handlePasswordEdit = (async (req, res, next, postgresDB, bcrypt)=> {

    const { password, confirmPassword } = req.body;
    if(!password || ! confirmPassword) {
        return res.status(400).json({error: "There was an issue changing your password."})
    }

    let hashPassword;

    try {
        hashedPassword = bcrypt.hashSync(password, 14);
    } catch (err) {
        return res.status(400).json({error: "Invalid password."})
    }

    let userIdAfterHashPW = await postgresDB.transaction(trx => {
        return trx("auth").where("user_id", "=", req.session.userId) 
        .returning("user_id")
        .update({
            password_hash:hashedPassword
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("There was an error with creating a new password.")
    })
    if(userIdAfterHashPW === undefined) {
        return res.status(400).json({error: "There was an error with creating a new password."})
    }

    return res.send(JSON.stringify({passwordEdited:"success"}))
 
})

module.exports = {
    handlePasswordEdit
}