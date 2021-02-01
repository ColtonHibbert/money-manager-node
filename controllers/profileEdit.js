
const handleProfileEdit = (async (req, res, next, postgresDB) => {
    const { firstName, lastName, address, phone ,about } = req.body;

    console.log("handleProfileEdit, firstName: ", firstName, req.session.userId)
    
    let updatedUser = await postgresDB.transaction(trx => {
        return (trx("user_")
        .where("user_id", "=", req.session.userId)
        .returning(["first_name", "last_name", "address", "phone", "about"])
        .update({
            first_name:firstName,
            last_name:lastName,
            address:address,
            phone:phone,
            about:about
        }
        )
        .then(trx.commit)
        .catch(trx.rollback)
        )
    })
    .catch(err => {
        console.log("Error in updated user");
    })
    console.log("handleProfileEdit, updatedUser: ",updatedUser);
    if(updatedUser === undefined) {
        return res.status(400).json({ error: "There was an error updating your profile."});
    }
    updatedUser = updatedUser[0];

    req.session.firstName = updatedUser.first_name;
    req.session.lastName = updatedUser.last_name;
    req.session.address = updatedUser.address;
    req.session.phone = updatedUser.phone;
    req.session.about = updatedUser.about;

    const user = {
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        address: updatedUser.address,
        phone: updatedUser.phone,
        about: updatedUser.about,
    }

    console.log("handleProfileEdit, user: ", user)

    return res.send(JSON.stringify({user}));

})

module.exports = {
    handleProfileEdit
}