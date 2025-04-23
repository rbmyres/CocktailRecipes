const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const router  = express.Router();

function query(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

router.post('/create', verifyJWT, async (req, res) => {
  const db = req.db;
  const user_id = req.user.id;
  const { title, primarySpirit, postType, ingredients, directions, imageURL } = req.body;

  if (
    !user_id || 
    !title?.trim() || 
    !primarySpirit ||
    !postType ||
    !Array.isArray(ingredients)   || ingredients.length === 0 ||
    !Array.isArray(directions)    || directions.length === 0 ||
    !imageURL
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const recipeResult = await query(
        db,
            `INSERT INTO recipe
            (user_id, recipe_title, post_type, primary_spirit, recipe_image)
            VALUES (?, ?, ?, ?, ?)`,
        [user_id, title.trim(), postType, primarySpirit, imageURL]
    );

    const recipe_id = recipeResult.insertId;

    for (let raw of directions) {
      const dir = raw.trim();
      if (!dir) continue;
      await query(
        db,
            `INSERT INTO direction
            (recipe_id, direction_description)
            VALUES (?, ?)`,
        [recipe_id, dir]
      );
    }

    for (let { desc: rawDesc, amt: rawAmt } of ingredients) {
      const desc = rawDesc.trim();
      const amt  = rawAmt.trim();
      if (!desc || !amt) continue;

      const rows = await query(
        db,
            `SELECT ingredient_id
            FROM ingredient
            WHERE ingredient_description = ?`,
        [desc]
      );

      let ingredient_id;
      if (rows.length) {
        ingredient_id = rows[0].ingredient_id;
      } else {
        const insertIng = await query(
          db,
            `INSERT INTO ingredient (ingredient_description)
            VALUES (?)`,
          [desc]
        );
        ingredient_id = insertIng.insertId;
      }

      await query(
        db,
            `INSERT INTO recipe_ingredient
            (recipe_id, ingredient_id, ingredient_amount)
            VALUES (?, ?, ?)`,
        [recipe_id, ingredient_id, amt]
      );
    }

    await query(
      db,
        `UPDATE users
        SET post_count = post_count + 1
        WHERE user_id = ?`,
      [user_id]
    );

    res.json({ success: true, recipe_id });
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).json({ error: 'Could not create recipe' });
  }
});

router.get('/small', async (req, res) => {
  const db = req.db;
  try{
    const posts = await query(
      db,
        `SELECT r.recipe_id, r.recipe_title, r.recipe_image, r.like_count, r.post_time, r.primary_spirit, r.post_type, u.user_name, u.user_icon
        FROM recipe r
        JOIN users u
        ON r.user_id = u.user_id
        ORDER BY r.post_time DESC`
    );
    res.json(posts);
  }
  catch (err){
    console.error(err);
    res.status(500).json({ error: "Fetch posts error"});
  }
});

router.get('/:id', async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try{
    const [recipe] = await query(db,
        `SELECT r.recipe_id, r.recipe_title, r.primary_spirit, r.post_type, r.recipe_image, r.like_count, r.post_time, u.user_name, u.user_icon
        FROM recipe r
        NATURAL JOIN users u
        WHERE recipe_id = ?`,
        [id]
      );

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found'});
      }

      const directions = await query(db,
        `SELECT direction_description as dir
        FROM direction
        WHERE recipe_id = ?`,
        [id]
      );

      const ingredients = await query(db, 
        `SELECT i.ingredient_description as ing, ri.ingredient_amount as amt
        FROM recipe_ingredient ri
        JOIN ingredient i
        ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?`,
        [id]
      );

      res.json({
        recipe_id: recipe.recipe_id,
        recipe_title: recipe.recipe_title,
        primary_spirit: recipe.primary_spirit,
        post_type: recipe.post_type,
        recipe_image: recipe.recipe_image,
        like_count: recipe.like_count,
        post_time: recipe.post_time,
        user_name: recipe.user_name,
        user_icon: recipe.user_icon,
        directions: directions.map(i => i.dir), 
        ingredients: ingredients.map(i => ({desc: i.ing, amt: i.amt}))});

  } catch (err) {
    console.error('Error fetching full post', err);
    res.status(500).json({error: 'Cound not find recipe'})

  }
});
module.exports = router;