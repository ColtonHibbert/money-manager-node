const handleDeleteIndividualAccount = (async (req, res, next, postgresDB) => {

    const {
        accountId
    } = req.body;

    let deletedAccount = await postgresDB.transaction(trx => {
        return trx("account")
        .where("account_id", "=", accountId)
        .returning("account_id")
        .del()
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("There was an error deleting account.")
    })
    if(deletedAccount === undefined) {
        return res.status(400).json({ error: "There was an error deleting the account." });
    }
    deletedAccount = deletedAccount[0];

    const deletedAccountResponse = {
        accountId: deletedAccount.account_id
    }

    return res.send(JSON.stringify(deletedAccountResponse));

})

module.exports = {
    handleDeleteIndividualAccount
}