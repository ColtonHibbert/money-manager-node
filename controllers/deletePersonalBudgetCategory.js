const handleDeletePersonalBudgetCategory = (async (req, res, next, postgresDB ) => {
    let {
        userId,
        itemName,
        personalBudgetCategoryId
    } = req.body;
    itemName = itemName.toLowerCase();

    let deletedPersonalBudgetCategory = await postgresDB.transaction(trx => {
        return trx("personal_budget_category")
        .where("personal_budget_category_id", "=", personalBudgetCategoryId)
        .returning("personal_budget_category_id")
        .del()
        .then(trx.commit)
        .catch(trx.rollback)
    })
    if(deletedPersonalBudgetCategory === undefined) {
        return res.status(400).json({error: "There was an error deleting the category."});
    }
    deletedPersonalBudgetCategory = deletedPersonalBudgetCategory[0];

    const deletedPersonalBudgetCategoryResponse = {
        personalBudgetCategoryId: deletedPersonalBudgetCategory.personal_budget_category_id
    }

    return res.send(JSON.stringify(deletedPersonalBudgetCategoryResponse))
}) 

module.exports = {
    handleDeletePersonalBudgetCategory
}