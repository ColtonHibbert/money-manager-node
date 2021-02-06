
const handleIndividualAccount = (req, res, next, postgresDB) => {
    //get request
    //need current balance, monthly spending - just grab transactions from current month, monthly deposits, monthly transactions
    // array of individual accounts
    // each individual account will have account transactions
    /*
    individualAccount: [
        account: {
            accountId: "",
            accountName: "",
            accountTypeId: "",
            currentBalance: "",
            lowAlertBalance: "",
            userId: ""
            transactions: [
                {
                    transaction_id,
                    amount,
                    date,
                    memo_note,
                    category_id,
                    category_item_id,
                    transaction_type_id,
                    user_id,
                    account_id INT
                }
            ]
        }
    ]

    */

}

module.exports = {
    handleIndividualAccount
}