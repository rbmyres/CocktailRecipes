const jwt = require("jsonwebtoken");

// Function to verify that the user's JWT matches the backends

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("No auth header found");
        return res.status(401).json({ message: "No auth token found" });
    }

    const token = authHeader.split(' ')[1];

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