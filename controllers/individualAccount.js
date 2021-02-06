
const handleIndividualAccount = (req, res, next, postgresDB) => {
    //get request
    //need current balance, monthly spending - just grab transactions from current month, monthly deposits, monthly transactions
    // array of individual accounts
    // each individual account will have account transactions
    // do I want to grab all transactions? or just current month?, I can still filter by month on the front end, I think I'll do that
    // 
    
    /*
    individualAccount: [
        account: {
            accountId: "",
            accountName: "",
            accountTypeId: "",
            currentBalance: "",
            lowAlertBalance: "",
            userId: "",
            userName--add,
            transactions: [
                {
                    transaction_id,
                    amount,
                    date,
                    memo_note,
                    category_id,
                    category_item_id,
                    category_name--add,
                    category_item_name--add,
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