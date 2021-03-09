
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

    // start of accounts 
    const accountsInDB = await postgresDB.select("*").from("account").where("user_id", "=", user.userId)
    .then(data => {
        //console.log("loadInitialData, accountsInDB: ", data);
        return data
    })
    .catch(err => res.status(400).json({error: "There was an error loading your data."}))

    const formatAccounts = (accountsInDB) => {
        let accountsObject = {};
        for(let i = 0; i < accountsInDB.length; i++) {
            let account = {
                accountId: accountsInDB[i].account_id,
                accountName: accountsInDB[i].account_name,
                currentBalance: Number(accountsInDB[i].current_balance),
                lowAlertBalance: Number(accountsInDB[i].low_alert_balance),
                userId: accountsInDB[i].user_id,
                accountTypeId: accountsInDB[i].account_type_id,
                userFirstName: req.session.firstName,
                transactions: [],
                transactionsMonthly: [],
                transactionsMonthlyQuantity: 0,
                depositsMonthlyQuantity: 0,
                depositsMonthlyAmount: 0,
                withdrawalsMonthlyQuantity: 0,
                withdrawalsMonthlyAmount: 0,
                transfersMonthlyQuantity: 0,
                transfersMonthlyAmount: 0
            }
            accountsObject[account.accountId] = account
        }
        return accountsObject;
    }

    const formatAccountsArray = (accountsInDB) => {
        let accountsArray = [];
        for(let i = 0; i < accountsInDB.length; i++) {
            let account = {
                accountId: accountsInDB[i].account_id,
                accountName: accountsInDB[i].account_name,
                currentBalance: Number(accountsInDB[i].current_balance),
                lowAlertBalance: Number(accountsInDB[i].low_alert_balance),
                userId: accountsInDB[i].user_id,
                accountTypeId: accountsInDB[i].account_type_id,
                userFirstName: req.session.firstName
            }
            accountsArray.push(account);
        }
        return accountsArray;
    }

    const individualAccounts = formatAccounts(accountsInDB);
    const accountSummary = formatAccountsArray(accountsInDB);
    // end of grabbing and formatting accounts


    // Start of creating personal budget categories and items
    // get all personal categories and personal items
    const personalBudgetCategoriesInDB = await postgresDB.select("*").from("personal_budget_category").where("user_id", "=", req.session.userId)
    .catch(err => {
        console.log("loadInitialData: error with getting personal budget categories");
        return res.status(400).json({error: "There was an error loading your data."});
    })

    const personalBudgetCategoryItemsInDB = await postgresDB.select("*").from("personal_budget_category_item").where("user_id", "=", req.session.userId)
    .catch(err => {
        console.log("loadInitialData: error with getting personal budget category items.");
        return res.status(400).json({error: "There was an error loading your data."});
    })
    //console.log("loadInitialData, personalBudgetCategoriesInDB: ", personalBudgetCategoriesInDB);
    //console.log("loadInitialData, personalBudgetCategoryItemsInDB: ", personalBudgetCategoryItemsInDB);

    // Grab unique Generic category ids and category item ids, 
    // we will later compare the ids to the personal, some categories like "other" may be repeated, we only need 1 of each generic which we will use to later map the generic name to the personal
    const uniqueCategoryIds = () => {
        const existingCategoryIdsObject = {};
        personalBudgetCategoriesInDB.map(category => {
            //console.log("category,",category);
            if(!existingCategoryIdsObject[category.category_id]) {
                existingCategoryIdsObject[category.category_id] = category.category_id;
            }
        }) 
        //console.log("loadInitialData, personal budget existingCategoryId's: ", existingCategoryIdsObject);

        const existingCategoryIdsArray = [];
        for(entry in existingCategoryIdsObject) {
            existingCategoryIdsArray.push(entry);
        }
        //console.log(existingCategoryIdsArray);

        return existingCategoryIdsArray;
    }

    const uniqueCategoryItemIds = () => {
        const existingCategoryItemIdsObject = {};
        personalBudgetCategoryItemsInDB.map(item => {
            //console.log("item", item)
            if(!existingCategoryItemIdsObject[item.category_item_id]) {
                existingCategoryItemIdsObject[item.category_item_id] = item.category_item_id;
            }
        }) 
        //console.log("loadInitialData, personal budget existingCategoryItemId's: ", existingCategoryItemIdsObject);

        const existingCategoryItemIdsArray = [];
        for(entry in existingCategoryItemIdsObject) {
            existingCategoryItemIdsArray.push(entry);
        }
        //console.log(existingCategoryItemIdsArray);

        return existingCategoryItemIdsArray;
    }

    const generalCategories = uniqueCategoryIds();
    const generalCategoryItems = uniqueCategoryItemIds();
    // end of getting unique general categories and items


    // get array of generic categories
    const categoryNamesArray = await postgresDB.select("*").from("category").whereIn("category_id", generalCategories)
    .catch(err => {
        console.log("loadInitialData, categoryNames error");
        return res.status(400).json({error: "There was an error loading your data."});
    })
    //console.log("loadInitialData, categoryNames: ", categoryNamesArray);

    //changing the generic categoryNamesArray into an object so we can do lookup/ memoize, 
    const makeCategoryNamesObject = () => {
        categoriesObject = {};
        categoryNamesArray.map(category => {
            categoriesObject[category.category_id] = {
                categoryId: category.category_id,
                categoryName: category.category_name
            }
        })
        return categoriesObject;
    }

    const categoryNamesObject = makeCategoryNamesObject();

    const categoryItemNamesArray = await postgresDB.select("*").from("category_item").whereIn("category_item_id", generalCategoryItems)
    .catch(err => {
        console.log("loadInitialData, categoryItemNames error");
        return res.status(400).json({error: "There was an error loading your data."});
    })
    //console.log("loadInitialData, categoryItemNames: ", categoryItemNamesArray);

    //changing generic categoryItemNamesArray to object to lookup/memoize
    const makeCategoryItemNamesObject = () => {
        itemsObject = {};
        categoryItemNamesArray.map(item => {
            itemsObject[item.category_item_id] = {
                categoryItemId: item.category_item_id,
                categoryItemName: item.category_item_name
            }
        })
        return itemsObject;
    }

    const categoryItemNamesObject = makeCategoryItemNamesObject();

    //console.log("loadInitialData, categoryNamesObject: ", categoryNamesObject);
    //console.log("loadInitialData, categoryItemNamesObject: ",categoryItemNamesObject);
    // end of getting the generic categories and items and converting them to objects



   // format categories into an object so we can do lookup/memoize easily 
   // each category wil have an items object that will also contain the category items in object format for easy lookup
    const formatCategoriesAndItems = () => {

        const categories = {};

        personalBudgetCategoriesInDB.map(categoryInstance => {
            const category = {
                personalBudgetCategoryId: categoryInstance.personal_budget_category_id,
                budgetAmount: Number(categoryInstance.budget_amount),
                categoryId: categoryInstance.category_id,
                userId: categoryInstance.user_id,
                name: categoryNamesObject[categoryInstance.category_id].categoryName,
                items: {}
            }
        const id = category.personalBudgetCategoryId;
        categories[id] = category;
        })

        
        personalBudgetCategoryItemsInDB.map(itemInstance => {
            const item = {
                personalBudgetCategoryItemId: itemInstance.personal_budget_category_item_id,
                personalBudgetCategoryId: itemInstance.personal_budget_category_id,
                categoryItemId: itemInstance.category_item_id,
                userId: itemInstance.user_id,
                name: categoryItemNamesObject[itemInstance.category_item_id].categoryItemName
            }
            categories[item.personalBudgetCategoryId].items[item.personalBudgetCategoryItemId] =  item;
            //console.log("item in categories and Items:", item);
        })
        
        return categories;
    }

    const categoriesAndItems = formatCategoriesAndItems();
    //console.log("loadInitialData, categoriesAndItems: ", categoriesAndItems);
    // end of formatting categories and items, this data will be used for the budget breakdown, 


    //formatTransactions, 
    //then add to account the specific transactions
    
    const transactionsInDB = await postgresDB.select("*").from("transaction_").where("user_id", "=", req.session.userId)
    .catch(err => {
        console.log("loadInitialData: error with getting transactions");
        return res.status(400).json({error: "There was an error loading your data."});
    })
    //console.log("transactionsInDB: ", transactionsInDB)

    const formatTransactions = () => {
        const transactionsArray = [];

        transactionsInDB.map(transaction => {
            const categoryName = categoriesAndItems[transaction.personal_budget_category_id].name;
            const categoryItemName = categoriesAndItems[transaction.personal_budget_category_id].items[transaction.personal_budget_category_item_id].name;
            //console.log(categoryItemName);

            const updatedTransaction = {
                transactionId: transaction.transaction_id,
                amount: Number(transaction.amount),
                date: transaction.date, 
                memoNote: transaction.memo_note,
                categoryName: categoryName,
                categoryItemName: categoryItemName,
                personalBudgetCategoryId: transaction.personal_budget_category_id,
                personalBudgetCategoryItemId: transaction.personal_budget_category_item_id,
                householdBudgetCategoryId: transaction.household_budget_category_id,
                householdBudgetCategoryItemId: transaction.household_budget_category_item_id,
                transactionTypeId: transaction.transaction_type_id,
                userId: transaction.user_id,
                accountId: transaction.account_id,
                edit: false,
                editTransactionAmount: 0,
                editTransactionTransactionTypeId: 0,
                editTransactionMemoNote: "",
                editTransactionPersonalBudgetCategoryId: 0,
                editTransactionPersonalBudgetCategoryItemId: 0,
                editTransactionDeleteDisplay: false, 
                editTransactionDeleteConfirmation: false

            };
            transactionsArray.push(updatedTransaction);
        })
        return transactionsArray;
    }
    const transactionsArray = formatTransactions();
    //FILTER HERE 
    //console.log("transactionsArray: ",transactionsArray)

    const date31DaysPrior = (Date.now() - (60000 * 60 * 24 * 31));
    
    const formatMonthlyTransactionsAllAccounts = (transactionsArray) => {
        const transactionsMonthlyAllAccounts = [];
        let withdrawalsQuantity = 0;
        let withdrawalsAmount = 0;
        let depositsQuantity = 0;
        let depositsAmount = 0;
        let transferQuantity = 0;
        let transferAmount = 0;


        transactionsArray.map(transaction => {
            //console.log(Date.parse(transaction.date) > date31DaysPrior)
            //console.log("date, date.parse, 31prior :", transaction.date, Date.parse(transaction.date), date31DaysPrior)
            if(Date.parse(transaction.date) > date31DaysPrior) {
                transactionsMonthlyAllAccounts.push(transaction);
            }
            if(Date.parse(transaction.date) > date31DaysPrior) {
                if(transaction.transactionTypeId === 1) {
                    //withdrawal
                    withdrawalsQuantity += 1;
                    withdrawalsAmount += transaction.amount;
                }
                if(transaction.transactionTypeId === 2) {
                    //deposit
                    depositsQuantity += 1;
                    depositsAmount += transaction.amount;
                }
                if(transaction.transactionTypeId === 3) {
                    //transfer
                    transferQuantity += 1;
                    transferAmount += transaction.amount;
                }
                
            }
            
        })

        const transactionData = {
            transactionsMonthlyAllAccounts: transactionsMonthlyAllAccounts,
            transactionsMonthlyAllAccountsQuantity: transactionsMonthlyAllAccounts.length,
            depositsMonthlyAllAccountsQuantity: depositsQuantity,
            depositsMonthlyAllAccountsAmount: depositsAmount,
            withdrawalsMonthlyAllAccountsQuantity: withdrawalsQuantity,
            withdrawalsMonthlyAllAccountsAmount: withdrawalsAmount,
            transfersMonthlyAllAccountsQuantity: transferQuantity,
            transfersMonthlyAllAccountsAmount: transferAmount
        };

        return transactionData
                
    }
   

    const transactionData = formatMonthlyTransactionsAllAccounts(transactionsArray);
  
    //console.log("transactionData:", transactionData);

    const formatIndividualAccountsWithTransactions = () => {

        //alter individualAccounts
        transactionsArray.map(transaction => {
            //console.log("individualAccounts[transaction.accountId], transaction.accountId",individualAccounts[transaction.accountId], transaction.accountId)
            if(individualAccounts[transaction.accountId].accountId === transaction.accountId) {
                //console.log("transaction push")
                individualAccounts[transaction.accountId].transactions.push(transaction);
            }
            if(individualAccounts[transaction.accountId].accountId === transaction.accountId && Date.parse(transaction.date) > date31DaysPrior) {
                individualAccounts[transaction.accountId].transactionsMonthly.push(transaction);
                individualAccounts[transaction.accountId].transactionsMonthlyQuantity += 1;
                ///console.log("transactionsmonthly push")
            }
            if(individualAccounts[transaction.accountId].accountId === transaction.accountId && Date.parse(transaction.date) > date31DaysPrior) {
                if(transaction.transactionTypeId === 1) {
                    //withdrawal
                    individualAccounts[transaction.accountId].withdrawalsMonthlyQuantity += 1;
                    individualAccounts[transaction.accountId].withdrawalsMonthlyAmount += transaction.amount;
                }
                if(transaction.transactionTypeId === 2) {
                    //deposit
                    individualAccounts[transaction.accountId].depositsMonthlyQuantity += 1;
                    individualAccounts[transaction.accountId].depositsMonthlyAmount += transaction.amount;
                }
                if(transaction.transactionTypeId === 3) {
                    //transfer
                    individualAccounts[transaction.accountId].transfersMonthlyQuantity += 1;
                    individualAccounts[transaction.accountId].transfersMonthlyAmount += transaction.amount;
                }
            }
         })


    }
    formatIndividualAccountsWithTransactions();
    //console.log("individualAccounts: ", individualAccounts);


    const formatIndividualAccountsToArray = () => {
        const individualAccountsKeysArray = [];
        for(account in individualAccounts) {
            individualAccountsKeysArray.push(account);
        }
        //console.log("individualaccountskeysarray", individualAccountsKeysArray);

        const individualAccountsArray = [];
        for(let i = 0; i < individualAccountsKeysArray.length; i++) {
            individualAccountsArray.push(individualAccounts[individualAccountsKeysArray[i]]);
        }
        //console.log("individualAccountsArray: ", individualAccountsArray);
        return individualAccountsArray;
    }
    const individualAccountsArray = formatIndividualAccountsToArray();
    //console.log(individualAccountsArray);

    const formatCategoriesAndItemsToArray = () => {
        const categoriesKeysArray = [];
        for(category in categoriesAndItems) {
            categoriesKeysArray.push(category);
        }
        //console.log("categorykeysArray, :", categoriesKeysArray);

        const categoriesAndItemsArray = [];
        for(let i = 0; i < categoriesKeysArray.length; i++) {
            categoriesAndItemsArray.push(categoriesAndItems[categoriesKeysArray[i]])   
            let tempArray = [];
            for(item in categoriesAndItemsArray[i].items) {
                tempArray.push(categoriesAndItemsArray[i].items[item])
            }
            categoriesAndItemsArray[i].items = tempArray;
        }
        //console.log(categoriesAndItemsArray);
        return categoriesAndItemsArray;
    }

    const categoriesAndItemsArray = formatCategoriesAndItemsToArray();

    const initialData = {
        user: user,
        accountSummary: accountSummary,
        individualAccounts: individualAccountsArray,
        categoriesAndItems: categoriesAndItemsArray,
        transactionsAllAccounts: transactionsArray,
        transactionsMonthlyAllAccounts: transactionData.transactionsMonthlyAllAccounts,
        transactionsMonthlyAllAccountsQuantity: transactionData.transactionsMonthlyAllAccountsQuantity,
        depositsMonthlyAllAccountsQuantity: transactionData.depositsMonthlyAllAccountsQuantity,
        depositsMonthlyAllAccountsAmount: transactionData.depositsMonthlyAllAccountsAmount,
        withdrawalsMonthlyAllAccountsQuantity: transactionData.withdrawalsMonthlyAllAccountsQuantity,
        withdrawalsMonthlyAllAccountsAmount: transactionData.withdrawalsMonthlyAllAccountsAmount,
        transfersMonthlyAllAccountsQuantity: transactionData.transfersMonthlyAllAccountsQuantity,
        transfersMonthlyAllAccountsAmount: transactionData.transfersMonthlyAllAccountsAmount
    }

    //console.log(initialData)
    return res.send(JSON.stringify({initialData}));

})

module.exports = {
    handleLoadInitialData
}