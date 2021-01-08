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
                accountId: data.account_id,
                accountName: data.account_name,
                currentBalance: data.current_balance,
                lowAlertBalance: data.low_alert_balance,
                userId: data.user_id,
                accountTypeId: data.account_type_id
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