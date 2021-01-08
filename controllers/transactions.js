
const handleTransactions = (async (req, res, next, postgresDB ) => {

    const userId = req.session.userId;
    console.log("handleTransactions: sessionid ", req.session.id );
    console.log("handleTransactions: userId: ", req.session.userId );
    
    const transactions = await postgresDB.select("*")
    .from("transaction_")
    .where("user_id", "=", userId)
    .then(data => {
        let transactionResponseArray = [];

        data.forEach(transaction => {
            let transactionResponse = {
                id: transaction.transaction_id,
                amount: transaction.amount,
                date: transaction.date,
                memoNote: transaction.memo_note,
                userId: transaction.user_id,
                accountTypeId: transaction.account_type_id
            }
            transactionResponseArray.push(transactionResponse);
        })
        res.send(JSON.stringify(transactionResponseArray));
    })
    .catch(err => console.log("error getting transactions"))
})

module.exports = {
    handleTransactions
}