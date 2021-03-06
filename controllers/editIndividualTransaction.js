
const handleEditIndividualTransaction = ( async (req, res, next, postgresDB) => {

    const {
        editTransactionAmount,
        editTransactionTransactionTypeId,
        editTransactionMemoNote,
        editTransactionPersonalBudgetCategoryId,
        editTransactionPersonalBudgetCategoryItemId,
        editTransactionTransactionId
    } = req.body;


    let previousTransaction = await postgresDB.select(["amount", "transaction_type_id"]).from("transaction_").where("transaction_id", "=", editTransactionTransactionId);
    previousTransaction = previousTransaction[0];


    let transaction = await postgresDB.transaction(trx => {
        return trx("transaction_").where("transaction_id", "=", editTransactionTransactionId)
        .returning("*")
        .update({
            amount: editTransactionAmount,
            transaction_type_id: editTransactionTransactionTypeId,
            memo_note: editTransactionMemoNote,
            personal_budget_category_id: editTransactionPersonalBudgetCategoryId,
            personal_budget_category_item_id: editTransactionPersonalBudgetCategoryItemId
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("There was an error updating the transaction.");
    })
    if(transaction === undefined ) {
        return res.status(400).json({error: "There was an error updating the transaction."});
    }
    transaction = transaction[0];
    
    let account = await postgresDB.select("*").from("account").where("account_id", "=", transaction.account_id);
    account = account[0];

    const configureAmount = () => {
        // undo old amount
        let undoAmount = null;
        if(previousTransaction.transaction_type_id === 1 || previousTransaction.transaction_type_id === 3) {
            // to undo the amount, if previous transaction was withdrawal or transfer we need to add to reverse the transaction
            undoAmount = Number(previousTransaction.amount);
        } else {
            //to undo an old deposit we need to take money away
            undoAmount = -Number(previousTransaction.amount); 
        }

        console.log(undoAmount,"undo amount")
        console.log(previousTransaction.amount, "previousTransaction.amount")
        //add new amount and counteract old amount
        if(transaction.transaction_type_id === 1 || transaction.transaction_type_id === 3) {
            console.log(-Number(transaction.amount) + undoAmount, "-Number(transaction.amount) + undoAmount")
            return -Number(transaction.amount) + undoAmount;
        } else {
            console.log(Number(transaction.amount) + undoAmount, "Number(transaction.amount) + undoAmount")
            return Number(transaction.amount) + undoAmount;
        }
    }

    const configuredAmount = configureAmount();

    let updatedAccount = await postgresDB.transaction(trx => {
        return trx("account").where("account_id", "=", account.account_id)
        .returning(["account_id", "current_balance"])
        .update({
            current_balance: Number(account.current_balance) + configuredAmount
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    if(updatedAccount ===  undefined) {
        return res.status(400).json({error: "There was an error updating the account while adding this transaction."})
    }
    updatedAccount = updatedAccount[0];
    console.log(updatedAccount);


    const configuredTransaction = {
        amount: Number(transaction.amount),
        transactionTypeId: transaction.transaction_type_id,
        memoNote: transaction.memo_note,
        personalBudgetCategoryId: transaction.personal_budget_category_id,
        personalBudgetCategoryItemId: transaction.personal_budget_category_item_id,
        transactionId: transaction.transaction_id,
        accountId: transaction.account_id,
        userId: transaction.user_id
    }

    const configuredAccount = {
        accountId: updatedAccount.account_id,
        currentBalance: Number(updatedAccount.current_balance)
    }

    const editResponse = {
        configuredTransaction,
        configuredAccount
    }

    return res.send(JSON.stringify(editResponse));

})

module.exports = {
    handleEditIndividualTransaction
}