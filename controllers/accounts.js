const handleAccounts = (async (req, res, next, postgresDB ) => {
    const userId = req.session.userId;
    console.log("handleAccounts: sessionid ", req.session.id );
    console.log("handleAccounts: userId: ", req.session.userId );

    const accounts = await postgresDB.select("*")
    .from("account")
    .where("user_id", "=", userId)
    .then(data => {
        let accountResponseArray = [];

        data.forEach(account => {
            let accountResponse = {
                accountId: account.account_id,
                accountName: account.account_name,
                currentBalance: account.current_balance,
                lowAlertBalance: account.low_alert_balance,
                userId: account.user_id,
                accountTypeId: account.account_type_id
            }
            accountResponseArray.push(accountResponse);
        })
        res.send(JSON.stringify(accountResponseArray));
    })
    .catch(err => console.log("error with getting accounts"))
})

module.exports = {
    handleAccounts
}