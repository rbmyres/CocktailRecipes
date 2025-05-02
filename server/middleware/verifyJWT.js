const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    const token = req.cookies.token;

    console.log("Cookie:", req.cookies); 
    console.log("Token:", token);

    if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "No auth token found" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT verification error", err);
            return res.sendStatus(403);
        }
        req.user = decoded;
        next();
    });
}

module.exports = verifyJWT;