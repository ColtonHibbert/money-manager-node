const handleAddTransaction = ( async(req, res, next, postgresDB) => {
    const {
    addTransactionAmount,
    addTransactionTransactionTypeId,
    addTransactionMemoNote,
    addTransactionPersonalBudgetCategoryId,
    addTransactionPersonalBudgetCategoryItemId,
    } = req.body;

    const updatedTransaction = await postgresDB.transaction(trx => {
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
    if(updatedTransaction === undefined) {
        return res.status(400).json({error: "There was an error adding the transaction"});
    }
    console.log(updatedTransaction)
    updatedTransaction = updatedTransaction[0];

    res.send(JSON.stringify(updatedTransaction));

})

module.exports = {
    handleAddTransaction
}