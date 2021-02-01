
const handleEmailEdit = (async (req, res, next, postgresDB) => {

    const { email } = req.body;
    if(!email) {
        return res.status(400).json({error: "You must enter a valid email address."})
    }

    let updatedEmail = await postgresDB.transaction(trx => {
        trx("user_").where("user_id", "=", req.session.userId) 
        .returning("email")
        .update({email:email})
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("There was an error updating the email address.")
    })
    if(updatedEmail === undefined) {
        return res.status(400).json({error: "There was an error updating the email address."})
    }
    console.log("handleEmailEdit, updatedEmail:", updatedEmail);
    updatedEmail = updatedEmail[0];

    req.session.email = updatedEmail;

    return res.send(JSON.stringify({updatedEmail}));
})

module.exports = {
    handleEmailEdit
}

