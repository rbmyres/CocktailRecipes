const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const optionalJWT = require('../middleware/optionalJWT');
const query = require('../utils/query');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = express.Router();

router.get('/search', async (req, res) => {
    const db = req.db;
    const search = (req.query.search || '').trim()

    if (!search.trim()) {
        return res.json([]);
    }

    const searchTerm = `%${search}%`;

    try{
        const users = await query(db,
            `SELECT user_id, user_name, user_icon 
            FROM users WHERE user_name LIKE ? ORDER BY user_name`,
            [searchTerm]
        );
        res.json(users);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ error: 'Could not search users' });
    }

});

router.get('/id/:user_name', (req, res) => {
    const user_name = req.params.user_name;
    const db = req.db;

    db.query(
        "SELECT user_id FROM users WHERE user_name = ?",
        [user_name],
        (err, result) => {
            if (err) res.status(500).send({ message: "Error finding user id"});

            if (result.length === 0) res.status(500).send({ error: "User not found"});

            
            return res.json(result[0]);
        }
    )
})

router.get('/edit/info', verifyJWT, (req, res) => {
    const user_id = req.user.id;
    const db = req.db;

    db.query(
        "SELECT first_name, last_name, user_name, user_email, private FROM users WHERE user_id = ?",
        [user_id],
        (err, result) => {
            if (err) res.status(500).send({ message: "Error retrieving user info"});

            return res.json(result[0]);
        }
    );
});

router.put('/submit/changes', verifyJWT, (req, res) => {
    const user_id = req.user.id;
    const { first_name, last_name, user_email, user_name, private} = req.body;
    const db = req.db;

    db.query(
        "SELECT user_name, user_email FROM users WHERE (user_name = ? OR user_email = ?) AND user_id != ? LIMIT 1",
        [user_name, user_email, user_id],
        (err, result) => {
            if(err){
                return res.status(500).send({message: "Error checking username/email"})
            }
            if(result.length > 0){
                const conflict = result[0];
                if (conflict.user_name === user_name){
                    return res.status(409).send({message: "Username already in use"}) 
                }
                if (conflict.user_email === user_email){
                    return res.status(409).send({message: "Email already in use"}) 
                }
            }
            db.query(
                "UPDATE users SET first_name = ?, last_name = ?, user_name = ?, user_email = ?, private = ? WHERE user_id = ?",
                [first_name, last_name, user_name, user_email, private? 1 : 0, user_id],
                (err, result) => {
                    if (err) {
                        return res.status(500).send({ message: "Error updating user info"})
                    }
                    return res.json({ message: "User info updated successfully"});
                }
            );
        }
    );
});

router.put('/change/password', verifyJWT, (req, res) => {
    const user_id = req.user.id;
    const { current_password, new_password } = req.body;
    const db = req.db;

    db.query(
        "SELECT user_password FROM users WHERE user_id = ?",
        [user_id],
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Error retrieving user password"});
            }
            if (result.length === 0) {
                return res.status(404).send({ message: "User not found"});
            }

            const hashedPassword = result[0].user_password;

            bcrypt.compare(current_password, hashedPassword, (err, isMatch) => {
                if (err) {
                    return res.status(500).send({ message: "Error comparing passwords" });
                }
                if (!isMatch) {
                    return res.status(401).send({ message: "Current password is incorrect" });
                }

                bcrypt.hash(new_password, saltRounds, (err, hash) => {
                    if (err) {
                        return res.status(500).send({ message: "Error hashing new password"});
                    }
                    newHash = hash;

                    db.query(
                        "UPDATE users SET user_password = ? WHERE user_id = ?",
                        [newHash, user_id],
                        (err, result) => {
                            if (err) {
                                return res.status(500).send({ message: "Error updating password"});
                            }
                            return res.json({ message: "Password updated successfully"});
                        }
                    );
                });
            });
        }
    );
});

router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const db = req.db;

    db.query(
        "SELECT user_id, user_name, first_name, last_name, user_icon, post_count, follower_count, following_count FROM users WHERE user_id = ?",
        [user_id],
        (err, result) => {
            if (err){
                return res.status(500).json({ message: "Server error"});
            }
            if (result.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            const user = result[0];
            return res.json({
                user_id: user.user_id,
                user_name: user.user_name,
                first_name: user.first_name,
                last_name: user.last_name,
                user_icon: user.user_icon,
                post_count: user.post_count,
                follower_count: user.follower_count,
                following_count: user.following_count
            })
        }
    )
});

router.delete('/delete/:user_id', verifyJWT, async (req, res) => {
    const db = req.db;
    const user_id = parseInt(req.params.user_id, 10);

    try {
        const [user] = await query(db,
          `SELECT user_id FROM users WHERE user_id = ?`,
          [user_id]
        );
    
        if(!user){
          return res.status(404).json({error: 'User not found'});
        }

        const liked = await query(db,
            'SELECT recipe_id FROM likes WHERE user_id = ?',
            [user_id]
          );
          for (let { recipe_id } of liked) {
            await query(db,
              'UPDATE recipes SET like_count = GREATEST(like_count - 1, 0) WHERE recipe_id = ?',
              [recipe_id]
            );
          }

          const follower = await query(db,
            'SELECT following_id FROM follow WHERE follower_id = ?',
            [user_id]
          );
          for (let { following_id } of follower) {
            await query(db,
              'UPDATE users SET follower_count = GREATEST(follower_count - 1, 0) WHERE user_id = ?',
              [following_id]
            );
          }

          const following = await query(db,
            'SELECT follower_id FROM follow WHERE following_id = ?',
            [user_id]
          );
          for (let { follower_id } of following) {
            await query(db,
              'UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE user_id = ?',
              [follower_id]
            );
          }
          
    
        await query(db,
          `DELETE FROM users WHERE user_id = ?`,
          [user_id]
        );
        return res.json({success: true})
      } catch (err) {
        console.error('Error deleting user', err);
        return res.status(500).json({ error: 'Could not delete user' });
      }
});

module.exports = router;