
const handleLoadInitialData = (async (req, res, next, postgresDB) => {
    const user = {
        userId: req.session.userId,
        firstName: req.session.firstName,
        lastName: req.session.lastName,
        email: req.session.email,
        address: req.session.address,
        phone: req.session.phone,
        about: req.session.about,
        joined: req.session.joined,
        householdMemberId: req.session.householdMemberId,
        householdId: req.session.householdId,
        roleId: req.session.roleId,
        csrf: req.csrfToken()
    }

    const accountsInDB = await postgresDB.select("*").from("account").where("user_id", "=", user.userId)
    .then(data => {
        return data
    })
    .catch(err => res.status(400).json({error: "There was an error loading your data."}))

    const accounts = (accountsInDB) => {
        let accountsArray = [];
        for(i = 0; i < accountsInDB.length; i++) {

        }
    }
    accounts(accountsInDB);

})

module.exports = {
    handleLoadInitialData
}