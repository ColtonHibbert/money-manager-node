const handleLogout = async(req, res, next, postgresDB ) => {

    const deletedSession = await postgresDB.transaction(trx => {
        return trx("session").returning("user_id").where("user_id", "=", req.session.userId).del()
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