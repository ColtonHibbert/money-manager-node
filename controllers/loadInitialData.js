
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

    // grab transactions, 

    //grab personal_budget_category and items, get the actual names
    // then map to transactions

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
    // has "other" aka category_item_1, we see this on entry 8

    //console.log("loadInitialData, personalBudgetCategoriesInDB: ", personalBudgetCategoriesInDB);
    //console.log("loadInitialData, personalBudgetCategoryItemsInDB: ", personalBudgetCategoryItemsInDB);

    // broken here // using ARRAYS not objects cant do lookup the same, only index
    const uniqueCategoryIds = () => {
        const existingCategoryIds = [];

    
        personalBudgetCategoriesInDB.map(category => {
            console.log("category,",category);
            if(!existingCategoryIds[category.category_id]) {
                existingCategoryIds.push(category.category_id);
            }
        }) 
        console.log("loadInitialData, personal budget existingCategoryId's: ", existingCategoryIds);
        return existingCategoryIds;
    }

    // broken here
    const uniqueCategoryItemIds = () => {
        const existingCategoryItemIds = [];

        personalBudgetCategoryItemsInDB.map(item => {
            console.log("item", item)
            if(existingCategoryItemIds[item.category_item_id]) {
                existingCategoryItemIds.push(item.category_item_id);
            }
        }) 
        console.log("loadInitialData, personal budget existingCategoryItemId's: ", existingCategoryItemIds);
        return existingCategoryItemIds;
    }
 
    const generalCategories = uniqueCategoryIds();
    const generalCategoryItems = uniqueCategoryItemIds();

    
    const categoryNamesArray = await postgresDB.select("*").from("category").whereIn("category_id", generalCategories)
    .catch(err => {
        console.log("loadInitialData, categoryNames error");
        return res.status(400).json({error: "There was an error loading your data."});
    })
    //console.log("loadInitialData, categoryNames: ", categoryNamesArray);

    
    //changing the names array into an object so we can do lookup/ memoize, 
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

    //changing names array to object to lookup/memoize
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

    //use array of category objects, with each having corresponding array of items, map the names
    const formatCategoriesAndItems = () => {

        const categories = {};

        personalBudgetCategoriesInDB.map(categoryInstance => {
            const category = {
                personalBudgetCategoryId: categoryInstance.personal_budget_category_id,
                budgetAmount: categoryInstance.budget_amount,
                categoryId: categoryInstance.category_id,
                userId: categoryInstance.user_id,
                name: categoryNamesObject[categoryInstance.category_id].categoryName,
                items: {}
            }
        const id = category.personalBudgetCategoryId;
        categories[id] = category;
        })

        
        personalBudgetCategoryItemsInDB.map(itemInstance => {
            console.log("itemInstance: ", itemInstance)
            const item = {
                personalBudgetCategoryItemId: itemInstance.personal_budget_category_item_id,
                personalBudgetCategoryId: itemInstance.personal_budget_category_id,
                categoryItemId: itemInstance.category_item_id,
                userId: itemInstance.user_id,
                name: categoryItemNamesObject[itemInstance.category_item_id].categoryItemName
            }
            
            console.log("item",  item)
            //categories[item.personalBudgetCategoryId].items[item.personalBudgetCategoryItemId] =  item;
        })
        
        return categories;
    }

    const categoriesAndItems = formatCategoriesAndItems();

    console.log("loadInitialData, categoriesAndItems: ", categoriesAndItems);

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