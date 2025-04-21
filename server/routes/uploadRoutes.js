const express = require('express');
const upload = require('../middleware/upload');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

router.post("/icon", verifyJWT, upload.single("icon"), (req, res, next) => {

    const iconURL = `/uploads/${req.file.filename}`;
    const user_id = req.user.id;
    const db = req.db;

    db.query(
        "UPDATE users SET user_icon = ? WHERE user_id = ?;",
        [iconURL, user_id],
        (err, result) => {
            if (err){
                return res.status(500).send({ message: "Server error"});
            }
            return res.json({ iconURL });
        }
    )

})

module.exports = router;