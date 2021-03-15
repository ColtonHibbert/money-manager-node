//return accountid and transaction id to front end
const handleDeleteIndividualTransaction = (async (req, res, next, postgresDB ) => {
    const {
        transactionId
    } = req.body;

    let deletedUser = await postgresDB.transaction(trx => {
        return trx("transaction_")
        .where("transaction_id", "=", transactionId)
        .returning(["transaction_id", "account_id"])
        .del()
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("There was an error deleting the transaction.");
    })
    if(deletedUser === undefined) {
        return res.status(400).json({error: "There was an error deleting the transaction."});
    }
    deletedUser = deletedUser[0];

    const deletedUserResponse = {
        transactionId: deletedUser.transaction_id,
        accountId: deletedUser.account_id
    }

    return res.send(JSON.stringify(deletedUserResponse));

})

module.exports = {
    handleDeleteIndividualTransaction
}