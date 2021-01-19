const handleCSRF = (req, res, next) => {
    console.log("get, /, req.csrfToken(): ", req.csrfToken());
    return res.send(JSON.stringify({csrf: req.csrfToken()}));
}

module.exports = {
    handleCSRF
}