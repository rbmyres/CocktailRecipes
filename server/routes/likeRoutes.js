const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const query = require('../utils/query');
const router = express.Router();

// Runs everytime the user clicks on the like button
// Checks if the user has liked the post (if row.length > 0)
// If the user has liked the post, that means they are unliking the post
//      -> Delete like from table and increment like_count
// If the user has not like the post, that means they are liking the post
//      -> Insert like into table and increment like_count
// Finally, return the new like count for this recipe so that it updates each click

router.post('/:recipe_id', verifyJWT, async (req, res) => {
    const db = req.db;
    const user_id = req.user.id;
    const recipe_id = req.params.recipe_id;

    try {
        const row = await query(
            db,
            `SELECT like_id FROM likes
            WHERE user_id = ? AND recipe_id = ?`,
            [user_id, recipe_id]
        );

        let liked;
        if (row.length > 0){

            await query(
                db,
                `DELETE FROM likes WHERE like_id = ?`,
                [row[0].like_id]
            );

            await query(
                db, 
                `UPDATE recipes
                SET like_count = like_count - 1
                WHERE recipe_id = ?`,
                [recipe_id]
            );

            liked = false;

        } else {

            await query(
                db,
                `INSERT INTO likes (user_id, recipe_id) VALUES (?, ?)`,
                [user_id, recipe_id]
            );

            await query(
                db,
                `UPDATE recipes
                SET like_count = like_count + 1
                WHERE recipe_id = ?`,
                [recipe_id]
            );

            liked = true;
        }

        const likeCountQuery = await query(
            db,
            `SELECT like_count FROM recipes
            WHERE recipe_id = ?`,
            [recipe_id]
        );

        const likeCount = likeCountQuery[0].like_count;

        return res.json({liked, like_count: likeCount})
    } catch (err) {
        console.error('Error updating likes', err);
        return res.status(500).json({ error: 'Error updating likes'});
    }
});

// Returns the list of users who like a specific post

router.get('/list/:recipe_id', (req, res) => {
    const { recipe_id } = req.params;
    const db = req.db;

    db.query(
        `SELECT u.user_id, u.user_name, u.user_icon 
        FROM likes l 
        JOIN users u
        ON l.user_id = u.user_id
        WHERE l.recipe_id = ?
        ORDER BY l.like_time DESC`,
        [recipe_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Get likes error"});

            return res.json(results);
        }
    );
});


module.exports = router;