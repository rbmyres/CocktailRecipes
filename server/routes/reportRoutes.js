const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const query = require('../utils/query');
const router = express.Router();

// Query to create a report for a certain recipe
// First, verify that the user has not reported this post
// Then, add the report

router.post('/:recipe_id', verifyJWT, async (req, res) => {
    const db = req.db;
    const user_id = req.user.id;
    const recipe_id = req.params.recipe_id;
    const { reason, description } = req.body;

    try {
        const row = await query(
            db,
            `SELECT report_id FROM reports
            WHERE user_id = ? AND recipe_id = ?`,
            [user_id, recipe_id]
        );

        if (row.length > 0) {
            return res.status(400).json({error: 'Cannot submit more than one report'});
        }

        await query(
            db,
            `INSERT into reports
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

// Query to retrieve all report information

router.get('/reports', async (req, res) => {
      try {
        const sql = `
          SELECT rp.report_id, rp.report_reason, rp.report_description, rp.report_time, rp.user_id AS reporter_id, u1.user_name AS reporter_name, rp.recipe_id, r.recipe_title, r.user_id AS owner_id, u2.user_name AS owner_name 
          FROM reports rp 
          JOIN users u1 ON rp.user_id    = u1.user_id
          JOIN recipes r ON rp.recipe_id  = r.recipe_id
          JOIN users u2 ON r.user_id     = u2.user_id
          ORDER BY rp.report_time DESC
        `;
  
        const reports = await query(req.db, sql, []);
        return res.json(reports);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not load reports' });
      }
    }
  );

  // Query to delete a report
  
  router.delete('/:report_id', verifyJWT, async (req, res) => {
    const db         = req.db;
    const report_id   = parseInt(req.params.report_id, 10);
  
    try {
      const result = await query(
        db,
        'DELETE FROM reports WHERE report_id = ?',
        [report_id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      return res.json({ success: true });
    } catch (err) {
      console.error('Error deleting report:', err);
      return res.status(500).json({ error: 'Could not delete report' });
    }
  });

module.exports = router;