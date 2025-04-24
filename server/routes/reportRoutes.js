const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const query = require('../utils/query');
const router = express.Router();

router.post('/:recipe_id', verifyJWT, async (req, res) => {
    const db = req.db;
    const user_id = req.user.id;
    const recipe_id = req.params.recipe_id;
    const { reason, description } = req.body;

    try {
        const row = await query(
            db,
            `SELECT report_id FROM report
            WHERE user_id = ? AND recipe_id = ?`,
            [user_id, recipe_id]
        );

        if (row.length > 0) {
            return res.status(400).json({error: 'Cannot submit more than one report'});
        }

        await query(
            db,
            `INSERT into report
            (user_id, recipe_id, report_reason, report_description)
            VALUES (?, ?, ?, ?)`,
            [user_id, recipe_id, reason, description]
        );

        return res.status(201).json({message: "Report successfully submitted"})

    } catch (err) {
        console.error("Error creating report", err);
        return res.status(500).json({error: 'Could not report post'});
    }
    
});

router.get('/list/:recipe_id', async (req, res) => {
    const db = req.db;
    const recipe_id = req.params.recipe_id;

    


})

module.exports = router;