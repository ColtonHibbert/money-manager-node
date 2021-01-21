const handlePasswordReset =(async (req, res, next, postgresDB, bcrypt) => {
    //doesnt work, 
    console.log("handlePasswordReset, req.params.token", req.params.token);
    return res.status(200).json(req.params.token);
})

module.exports = {
    handlePasswordReset
}