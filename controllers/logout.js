const handleLogout = async(req, res, next, postgresDB ) => {

    const deletedSession = await postgresDB.transasction(trx => {
        return trx.delete("*").from("session").where("user_id", "=", req.userId)
        .returning("user_id")
        .then(trx.commit)
        .catch(trx.rollback)
    })
    console.log("logoutHandler, deletedSession: ", deletedSession);
    if(!deletedSession[0]) {
        return res.status(400).json({ logoutAttempt: "failed" });
    }

    req.session.destroy((err) => {
        res.clearCookie("mySession");
        return res.status(200).json({ logoutAttempt: "success" });
    })
}

module.exports = {
    handleLogout
}