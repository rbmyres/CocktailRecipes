const express = require('express');
const upload = require('../middleware/upload');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

router.post("/icon", verifyJWT, upload.single("user_icon"), (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: 'No icon provided' })
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

router.post('/recipe_image', verifyJWT, upload.single('recipe_image'), (req, res) => {
      if (!req.file) return res.status(400).json({ message: 'No recipe image provided' })

      const imageURL = `/uploads/${req.file.filename}`

      res.json({ imageURL })
    }
  )

module.exports = router;