const handleAccounts = (async (req, res, next, postgresDB ) => {
    const userId = req.session.userId;

    const accounts = await postgresDB.select("*")
    .from("account")
    .where("user_id", "=", userId)
    .then(data => res.send(JSON.stringify(data)))
    .catch(err => console.log("error with getting accounts"))
})

module.exports = {
    handleAccounts
}