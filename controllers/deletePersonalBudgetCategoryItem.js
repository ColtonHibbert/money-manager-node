const handleDeletePersonalBudgetCategoryItem = (async (req, res, next, postgresDB ) => {
    let {
        userId,
        personalBudgetCategoryId,
        personalBudgetCategoryItemId
    } = req.body;

    let deletedPersonalBudgetCategoryItem = await postgresDB.transaction(trx => {
        return trx("personal_budget_category_item")
        .where("personal_budget_category_item_id", "=", personalBudgetCategoryItemId)
        .returning(["personal_budget_category_id", "personal_budget_category_item_id"])
        .del()
        .then(trx.commit)
        .catch(trx.rollback)
    })
    if(deletedPersonalBudgetCategoryItem === undefined) {
        return res.status(400).json({error: "There was an error deleting the category."});
    }
    deletedPersonalBudgetCategoryItem = deletedPersonalBudgetCategoryItem[0];

    deletedPersonalBudgetCategoryItem = {
        personalBudgetCategoryId: deletedPersonalBudgetCategoryItem.personal_budget_category_id,
        personalBudgetCategoryItemId: deletedPersonalBudgetCategoryItem.personal_budget_category_item_id
    }
    
    return res.send(JSON.stringify(deletedPersonalBudgetCategoryItem))
}) 

module.exports = {
    handleDeletePersonalBudgetCategoryItem
}