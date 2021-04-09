const handleAddPersonalBudgetCategory = ( async (req, res, next, postgresDB ) => {
    let {
        userId, 
        categoryName,
        budgetAmount
    } = req.body;
    //lowercase categories to validate uniqueness 
    categoryName = categoryName.toLowerCase();

    let category = await postgresDB.select("*").from("category").where("category_name", "=", categoryName);
    console.log("category  before insert: ", category)
    //insert general category if it doesn't exist
    await (async () => {
        if(Array.isArray(category) && category.length) {
            return;
        }
        console.log("inserting general category here")
        // insert category , change from undefined
        category = await postgresDB.transaction(trx => {
            return trx.insert({ 
                category_name: categoryName
            })
            .into("category")
            .returning("*") 
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            console.log("This category already exists or there was an error.");
        })
        return;
    })();
    if(category === undefined || !Array.isArray(category) || !category.length) {
        console.log("There was an error inserting the category.");
        return res.status(400).json({error: "There was an error inserting the category."});
    }
    category = category[0];
    console.log("category after insert:", category)

    // check personal category, add if not there, if already exists respond as such with a notification
    let personalBudgetCategory = await postgresDB.select("*").from("personal_budget_category").where({
        user_id: userId,
        category_id: category.category_id
    });
    console.log("personal budget category exists", personalBudgetCategory);
    if(personalBudgetCategory !== undefined && (Array.isArray(personalBudgetCategory) && personalBudgetCategory.length )) {
        return res.json({exists: "This personal category already exists."});
    }

    await (async () => {
        if(personalBudgetCategory !== undefined && (Array.isArray(personalBudgetCategory) && personalBudgetCategory.length )) {
            return;
        }
        console.log("inserting personal budget category")
        personalBudgetCategory = await postgresDB.transaction(trx => {
            return trx.insert({
                user_id: userId,
                category_id: category.category_id,
                budget_amount: budgetAmount,
            })
            .into("personal_budget_category")
            .returning("*")
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            console.log("There was an error inserting the personal budget category.")
        })
        return;
    })();
    console.log(personalBudgetCategory)
    if(personalBudgetCategory === undefined || !Array.isArray(personalBudgetCategory || !personalBudgetCategory.length )) {
        return res.status(400).json({error: "There was an error inserting the personal budget category."})
    }
    console.log(personalBudgetCategory)
    personalBudgetCategory = personalBudgetCategory[0];
    console.log("personal budget category after insertion:", personalBudgetCategory)

    const personalBudgetCategoryResponse = {
        personalBudgetCategoryId: personalBudgetCategory.personal_budget_category_id,
        budgetAmount: Number(personalBudgetCategory.budget_amount),
        categoryId: personalBudgetCategory.category_id,
        userId: personalBudgetCategory.user_id,
        categoryName: category.category_name
    }

    return res.send(JSON.stringify(personalBudgetCategoryResponse));
    
})

module.exports = {
    handleAddPersonalBudgetCategory
}