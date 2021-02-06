
const handleLoadInitialData = (async (req, res, next, postgresDB) => {
    const user = {
        userId: req.session.userId,
        firstName: req.session.firstName,
        lastName: req.session.lastName,
        email: req.session.email,
        address: req.session.address,
        phone: req.session.phone,
        about: req.session.about,
        joined: req.session.joined,
        householdMemberId: req.session.householdMemberId,
        householdId: req.session.householdId,
        roleId: req.session.roleId,
        csrf: req.csrfToken()
    }

    const accountsInDB = await postgresDB.select("*").from("account").where("user_id", "=", user.userId)
    .then(data => {
        console.log("loadInitialData, accountsInDB: ", data);
        return data
    })
    .catch(err => res.status(400).json({error: "There was an error loading your data."}))

    const formatAccounts = (accountsInDB) => {
        let accountsArray = [];
        for(let i = 0; i < accountsInDB.length; i++) {
            let account = {
                accountId: accountsInDB[i].account_id,
                accountName: accountsInDB[i].account_name,
                currentBalance: accountsInDB[i].current_balance,
                lowAlertBalance: accountsInDB[i].low_alert_balance,
                userId: accountsInDB[i].user_id,
                accountTypeId: accountsInDB[i].account_type_id,
                userFirstName: req.session.firstName
            }
            accountsArray.push(account);
        }
        return accountsArray;
    }
    const accounts = formatAccounts(accountsInDB);

    const individualAccounts = [
        {
            accounts: accounts
        }
    ]

    const transactionsInDB = await postgresDB.select("*").from("transaction_").where("user_id", "=", req.session.userId)
    .catch(err => {
        console.log("loadInitialData: error with getting transactions");
        return res.status(400).json({error: "There was an error loading your data."});
    })

    const categoryFilter = () => {
        const existingCategoryIds = [];

        transactionsInDB.map(transaction => {
            if(!existingCategoryIds[transaction.category_id]) {
                existingCategoryIds.push(transaction.category_id);
            }
        })
        console.log("loadInitialData, existingCategoryIds: ",existingCategoryIds);
        return existingCategoryIds;
    }

    const categoryItemFilter = () => {
        const existingCategoryItemIds = []; 

        transactionsInDB.map(transaction => {
            if(!existingCategoryItemIds[transaction.category_item_id]) {
                existingCategoryItemIds.push(transaction.category_item_id);
            }
        })
        console.log("loadInitialData, existingCategoryItemIds: ", existingCategoryItemIds);
        return existingCategoryItemIds;
    }

    //transactions should? belong to a specific personal budget category, and personal budget_items to a personal category
    // redo transactions table remove plain category and items, add personal category and items, and also household category and items, they can be null for only personal accounts
    // redo constraints

    const categoryNames = await postgresDB.select("*").from("category").whereIn("category_id", "=", categoryFilter)
    .catch(err => {
        console.log("loadInitialData, categoryNames error");
        return res.status(400).json({error: "There was an error loading your data."});
    })
    console.log("loadInitialData, categoryNames: ", categoryNames);

    const categoryItemNames = await postgresDB.select("*").from("category_item").whereIn("category_item_id", "=", categoryItemFilter)
    .catch(err => {
        console.log("loadInitialData, categoryItemNames error");
        return res.status(400).json({error: "There was an error loading your data."});
    })
    console.log("loadInitialData, categoryItemNames: ", categoryItemNames);

    //formatTransactions, then we build the transactions per account


    /*
    transactionsInDB.map(transaction => {
        transaction.category_id === categoryNames[memoizeCategoryId]
    })
    */
    
    const formatTransactions = () => {

        let transactionsArray = [];

        transactionsInDB.map(transaction => {
            const categoryName = categoryNames[transaction.category_id].category_name;

            const updatedTransaction = {
                transactionId: transaction_id,
                amount: amount,
                date: date, 
                memoNote: memo_note,
                categoryId: category_id,
                categoryName: categoryName,
            };
            transactionsArray.push(updatedTransaction);
        })
    }

    const formatIndividualAccounts = () => {
        transactionsInDB.map(transaction => {
            if(individualAccounts.accounts.accountId === transaction.account_id) {

            }
        })
        // of of O of n, can do map through transactions, if account id matches, push to individualAccount of that Id,
    }

    const initialData = {
        user: user,
        accounts: accounts
    }

    return res.send(JSON.stringify({initialData}));

})

module.exports = {
    handleLoadInitialData
}