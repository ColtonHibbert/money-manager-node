//return accountid and transaction id to front end
const handleDeleteIndividualTransaction = (async (req, res, next, postgresDB ) => {

    const {
        deleteTransactionId
        } = req.body;

        let deletedTransaction = await postgresDB.transaction(trx => {
            return trx("transaction_")
            .where("transaction_id", "=", deleteTransactionId)
            .returning("*")
            .del()
            .then(trx.commit)
            .catch(trx.rollback)
        })
        if(deletedTransaction === undefined) {
            return res.status(400).json({error: "There was an error deleting the transaction"});
        }
        deletedTransaction = deltedTransaction[0]; 
    
        const configureAmount = () => {
            if(deletedTransaction.transaction_type_id === 1 || deletedTransaction.transaction_type_id === 3) {
                return Number(deletedTransaction.amount);
            } else {
                return -Number(deletedTransaction.amount);
            }
        }
    
        const configuredAmount = configureAmount();
    
        let account = await postgresDB.select("*").from("account").where("account_id", "=", deletedTransaction.account_id);
        if(account === undefined) {
            return res.status(400).json({error: "There was an error in deleting the transaction"});
        }
        account = account[0];
    
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
            return res.status(400).json({error: "There was an error updating the account while deleting this transaction."})
        }
        updatedAccount = updatedAccount[0];
        console.log(updatedAccount);
    
        
        const configuredTransaction = {
            transactionId: deletedTransaction.transaction_id,
            transactionTypeId: deleteTransaction.transaction_type_id
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
    handleDeleteIndividualTransaction
}