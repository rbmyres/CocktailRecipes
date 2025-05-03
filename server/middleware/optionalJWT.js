const jwt = require("jsonwebtoken");

function optionalJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];

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