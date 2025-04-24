const jwt = require("jsonwebtoken");

function optionalJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT verification error", err);
            req.user = null;
        } else {
            req.user = decoded;
        }
        next();
    });

}

module.exports = optionalJWT;