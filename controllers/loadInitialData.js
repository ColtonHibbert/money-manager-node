
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
            const item = {
                personalBudgetCategoryItemId: itemInstance.personal_budget_category_item_id,
                personalBudgetCategoryId: itemInstance.personal_budget_category_id,
                categoryItemId: itemInstance.category_item_id,
                userId: itemInstance.user_id,
                name: categoryItemNamesObject[itemInstance.category_item_id].categoryItemName
            }
            categories[item.personalBudgetCategoryId].items[item.personalBudgetCategoryItemId] =  item;
        })
        
        return categories;
    }

    const categoriesAndItems = formatCategoriesAndItems();
    // console.log("loadInitialData, categoriesAndItems: ", categoriesAndItems);
    // end of formatting categories and items, this data will be used for the budget breakdown, 
    // the formatted categories and items will be mapped to the transactions

  

    //formatTransactions, then we build the transactions per account
    
   const transactionsInDB = await postgresDB.select("*").from("transaction_").where("user_id", "=", req.session.userId)
   .catch(err => {
       console.log("loadInitialData: error with getting transactions");
       return res.status(400).json({error: "There was an error loading your data."});
   })

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