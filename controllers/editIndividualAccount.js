const handleEditIndividualAccount = (async (req, res, next, postgresDB ) => {

    const {
        accountId,
        editAccountName,
        editAccountTypeId,
        editAccountLowAlertBalance
    } = req.body;

    let updatedAccount = await postgresDB.transaction(trx => {
        return trx("account").where("account_id", "=", accountId)
        .returning(["account_id", "account_name", "low_alert_balance", "account_type_id"])
        .update({
            account_name: editAccountName,
            account_type_id: editAccountTypeId,
            low_alert_balance: editAccountLowAlertBalance
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("There was an error updating the account.");
    })
    if(updatedAccount ===  undefined) {
        return res.status(400).json({error: "There was an error updating the account."})
    }
    updatedAccount = updatedAccount[0];
    console.log(updatedAccount)

    const updatedAccountResponse = {
        accountId: updatedAccount.account_id,
        accountName: updatedAccount.account_name,
        accountTypeId: updatedAccount.account_type_id,
        lowAlertBalance: Number(updatedAccount.low_alert_balance)
    }
    console.log(updatedAccountResponse)


    return res.send(JSON.stringify(updatedAccountResponse));


})

module.exports = {
    handleEditIndividualAccount
}