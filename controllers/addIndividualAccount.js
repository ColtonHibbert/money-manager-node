const handleAddIndividualAccount = (async (req, res, next, postgresDB) => {
    const {
        accountName, 
        accountTypeId,
        currentBalance,
        lowAlertBalance,
        userId
    } = req.body;

    let newAccount = await postgresDB.transaction(trx => {
        return trx.insert({
            account_name: accountName, 
            account_type_id: accountTypeId,
            current_balance: currentBalance,
            low_alert_balance: lowAlertBalance,
            user_id: userId
        })
        .into("account")
        .returning("*")
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("There was an error adding a new account.");
    })
    if(newAccount === undefined) {
        return res.status(400).json({error: "There was an error adding the account."})
    }
    newAccount = newAccount[0];

    const accountResponse = {
        accountId: newAccount.account_id,
        accountName: newAccount.account_name,
        accountTypeId: newAccount.account_type_id,
        currentBalance: Number(newAccount.current_balance),
        lowAlertBalance: Number(newAccount.low_alert_balance),
        userId: newAccount.user_id
    }

    return res.send(JSON.stringify(accountResponse));

})

module.exports = {
    handleAddIndividualAccount,
}