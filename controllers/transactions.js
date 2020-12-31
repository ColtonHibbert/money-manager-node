
const handleTransactions = (async (req, res, next, postgresDB ) {

    const userId = req.session.userId;
    
    const transactions = await postgresDB.select("*")
    .from("transaction_")
    .where("user_id", "=", userId)
    .then(data => res.send(JSON.stringify(data)))
    .catch(err => console.log("error getting transactions"))
})

module.exports = {
    handleTransactions
}