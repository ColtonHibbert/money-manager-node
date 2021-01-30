
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
})

module.exports = {
    handleProfileEdit
}