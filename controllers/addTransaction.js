const handleAddTransaction = ( async(req, res, next, postgresDB) => {
    const {
    addTransactionAmount,
    addTransactionTransactionTypeId,
    addTransactionMemoNote,
    addTransactionPersonalBudgetCategoryId,
    addTransactionPersonalBudgetCategoryItemId,
    addTransactionUserId,
    addTransactionAccountId
    } = req.body;

    let transaction = await postgresDB.transaction(trx => {
        return trx.insert({
            amount: addTransactionAmount,
            memo_note: addTransactionMemoNote,
            personal_budget_category_id: addTransactionPersonalBudgetCategoryId,
            personal_budget_category_item_id: addTransactionPersonalBudgetCategoryItemId,
            transaction_type_id: addTransactionTransactionTypeId,
            user_id: addTransactionUserId,
            account_id: addTransactionAccountId,
        })
        .into("transaction_")
        .returning("*")
        .then(trx.commit)
        .catch(trx.rollback)
    })
    if(transaction === undefined) {
        return res.status(400).json({error: "There was an error adding the transaction"});
    }
    console.log(transaction)
    transaction = transaction[0]; 

    const configureAmount = () => {
        if(transaction.transaction_type_id === 1 || transaction.transaction_type_id === 3) {
            return -Number(transaction.amount);
        } else {
            return Number(transaction.amount);
        }
    }

    const configuredAmount = configureAmount();

    let account = await postgresDB.select("*").from("account").where("account_id", "=", transaction.account_id);
    account = account[0];
    console.log(account);
    console.log(account.account_id);
    console.log(account.current_balance);
    console.log(Number(account.current_balance))
    console.log(configuredAmount);
    console.log("math it", Number(account.current_balance) + configuredAmount)
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
        transactionId: transaction.transaction_id,
        amount: Number(transaction.amount),
        date: transaction.date, 
        memoNote: transaction.memo_note,
        personalBudgetCategoryId: transaction.personal_budget_category_id,
        personalBudgetCategoryItemId: transaction.personal_budget_category_item_id,
        householdBudgetCategoryId: transaction.household_budget_category_id,
        householdBudgetCategoryItemId: transaction.household_budget_category_item_id,
        transactionTypeId: transaction.transaction_type_id,
        userId: transaction.user_id,
        accountId: transaction.account_id,
        edit: false
    };

    const configuredAccount = {
        accountId: updatedAccount.account_id,
        currentBalance: Number(updatedAccount.current_balance)
    }

    const transactionResponse = {
        configuredTransaction,
        configuredAccount
    }


   res.send(JSON.stringify(transactionResponse));

})

module.exports = {
    handleAddTransaction
}