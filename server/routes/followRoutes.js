const express = require('express');

const router = express.Router();

router.get('/check', (req, res) => {
    const { follower_id, following_id } = req.query;
    const db = req.db;

    db.query(
        "SELECT 1 FROM follow WHERE follower_id = ? and following_id = ?",
        [follower_id, following_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Check error" });
            res.json({ isFollowing: result.length > 0});
        }
    );
});

router.post('/follow', (req, res) => {
    const { follower_id, following_id} = req.body;
    const db = req.db;

    db.query(
        "INSERT INTO follow (follower_id, following_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE follow_time = CURRENT_TIMESTAMP",
        [follower_id, following_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Follow error" });

            db.query("UPDATE users SET following_count = following_count + 1 WHERE user_id = ?", [follower_id]);
            db.query("UPDATE users SET follower_count = follower_count + 1 WHERE user_id = ?", [following_id]);

            res.json({ success: true });
        }
    );
});

router.post('/unfollow', (req, res) => {
    const { follower_id, following_id } = req.body;
    const db = req.db;

    db.query(
        "DELETE FROM follow WHERE follower_id = ? AND following_id = ?",
        [follower_id, following_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Delete error" });

            db.query("UPDATE users SET following_count = following_count - 1 WHERE user_id = ?", [follower_id]);
            db.query("UPDATE users SET follower_count = follower_count - 1 WHERE user_id = ?", [following_id]);

            res.json({ success: true });
        }
    );
});

router.get('/followers/:user_id', (req, res) => {
    const { user_id } = req.params;
    const db = req.db;

    db.query(
        "SELECT u.user_id, u.user_name, u.user_icon FROM follow f JOIN users u ON f.follower_id = u.user_id WHERE f.following_id = ? ORDER BY f.follow_time desc",
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Get followers error"});

            return res.json(results);
        }
    );
});

router.get('/following/:user_id', (req, res) => {
    const { user_id } = req.params;
    const db = req.db;

    db.query(
        "SELECT u.user_id, u.user_name, u.user_icon FROM users u LEFT JOIN follow f ON f.following_id = u.user_id WHERE f.follower_id = ? ORDER BY f.follow_time desc",
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Get following error"});

            return res.json(results);
        }
    );
});

module.exports = router;