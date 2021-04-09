const handleAddPersonalBudgetCategoryItem = (async (req, res, next, postgresDB) => {
    let {
        userId,
        itemName,
        personalBudgetCategoryId
    } = req.body;
    itemName = itemName.toLowerCase();
    
    //check general items, insert if doesn't exist
    let item = await postgresDB.select("*").from("category_item").where("category_item_name", "=", itemName);
    console.log("item check general items: ", item);
    
    await (async () => {
        if(Array.isArray(item) && item.length) {
            return;
        }
        console.log("inserting general item here");
        item = await postgresDB.transaction(trx => {
            return trx.insert({
                category_item_name: itemName
            })
            .into("category_item")
            .returning("*")
            .then(trx.commit)
            .catch(trx.rollback)
        }).catch(err => {
            console.log("There was an error inserting a general item.");
        })
        return;
    })();
    if(item === undefined || !Array.isArray(item) || !item.length) {
        return res.status(400).json({error: "There was an error inserting a general item."});
    }
    item = item[0];
    console.log("general item after insert: ", item);

    //check if personalBudgetCategoryItem already exists
    let personalBudgetCategoryItem = await postgresDB.select("*").from("personal_budget_category_item").where({
        user_id: userId,
        personal_budget_category_id: personalBudgetCategoryId,
        category_item_id: item.category_item_id
    })
    console.log("personalBudgetCategoryItem exists: ", personalBudgetCategoryItem);
    if(personalBudgetCategoryItem !== undefined && (Array.isArray(personalBudgetCategoryItem) && personalBudgetCategoryItem.length )) {
        return res.json({exists: "This personal budget item already exists in this category."});
    }

    //check personal items, insert if doesn't exist
    await (async () => {
        personalBudgetCategoryItem =  await postgresDB.transaction(trx => {
            return trx.insert({
                user_id: userId,
                category_item_id: item.category_item_id,
                personal_budget_category_id: personalBudgetCategoryId
            })
            .into("personal_budget_category_item")
            .returning("*")
            .then(trx.commit)
            .catch(trx.rollback)
        }).catch(err => {
            console.log("There was an error inserting a personal budget category item.");
        })
        return;
    })();
    if(personalBudgetCategoryItem === undefined || !Array.isArray(personalBudgetCategoryItem) || !personalBudgetCategoryItem.length) {
        return res.status(400).json({error: "There was an error inserting a personal budget category item." });
    }
    personalBudgetCategoryItem = personalBudgetCategoryItem[0];
    console.log("personalBudgetCategoryItem after insertion: ", personalBudgetCategoryItem);
    
    const personalBudgetCategoryItemResponse = {
        personalBudgetCategoryItemId: personalBudgetCategoryItem.personal_budget_category_item_id,
        personalBudgetCategoryId: personalBudgetCategoryItem.personal_budget_category_id,
        categoryItemId: personalBudgetCategoryItem.category_item_id,
        userId: personalBudgetCategoryItem.user_id,
        itemName: item.category_item_name
    }

    return res.send(JSON.stringify(personalBudgetCategoryItemResponse));
})

module.exports = {
    handleAddPersonalBudgetCategoryItem
}