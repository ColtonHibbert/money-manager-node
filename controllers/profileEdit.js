
const handleProfileEdit = (async (req, res, next, postgresDB) => {
    const { firstName, lastName, address, phone ,about } = req.body;
    
    const updatedUser = await postgresDB.transaction(trx => {
        return trx("user_").where("user_id", "=", req.userId).returning("first_name", "last_name", "address", "phone", "about")
        .update({
            first_name:firstName,
            last_name:lastName,
            address:address,
            phone:phone,
            about:about
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    console.log("handleProfileEdit, updatedUser: ",updatedUser);
    if(updatedUser === undefined) {
        return res.status(400).json({ error: "There was an error updating your profile."});
    }


    const user = {
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        address: updatedUser.address,
        phone: updatedUser.phone,
        about: updatedUser.about,
    }

    return res.send(JSON.stringify(user));

})

module.exports = {
    handleProfileEdit
}