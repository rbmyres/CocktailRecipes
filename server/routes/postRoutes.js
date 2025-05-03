const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const optionalJWT = require('../middleware/optionalJWT');
const query = require('../utils/query');
const router  = express.Router();

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
            `INSERT INTO recipes
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
            `INSERT INTO directions
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
            FROM ingredients
            WHERE ingredient_description = ?`,
        [desc]
      );

      let ingredient_id;
      if (rows.length) {
        ingredient_id = rows[0].ingredient_id;
      } else {
        const insertIng = await query(
          db,
            `INSERT INTO ingredients (ingredient_description)
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

router.put('/:recipe_id', verifyJWT, async (req, res) => {
  const db = req.db;
  const user_id = req.user.id;
  const recipe_id = req.params.recipe_id;

  const {title, primarySpirit, postType, ingredients, directions, imageURL } = req.body;

  if (
    !title?.trim() ||
    !primarySpirit ||
    !postType ||
    !imageURL ||
    !Array.isArray(ingredients) || ingredients.length === 0 ||
    !Array.isArray(directions)  || directions.length === 0
  ) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await query(
      db,
      `UPDATE recipes
         SET recipe_title   = ?,
             post_type      = ?,
             primary_spirit = ?,
             recipe_image   = ?
       WHERE recipe_id = ?`,
      [title.trim(), postType, primarySpirit, imageURL, recipe_id]
    )

    await query(
      db,
      `DELETE FROM directions WHERE recipe_id = ?`,
      [recipe_id]
    )
    for (let raw of directions) {
      const dir = raw.trim()
      if (!dir) continue

      await query(
        db,
        `INSERT INTO directions
           (recipe_id, direction_description)
         VALUES (?, ?)`,
        [recipe_id, dir]
      )
    }

    await query(
      db,
      `DELETE FROM recipe_ingredient WHERE recipe_id = ?`,
      [recipe_id]
    )
    for (let { desc: rawDesc, amt: rawAmt } of ingredients) {
      const desc = rawDesc.trim()
      const amt  = rawAmt.trim()
      if (!desc || !amt) continue

      const rows = await query(
        db,
        `SELECT ingredient_id
           FROM ingredients
          WHERE ingredient_description = ?`,
        [desc]
      )

      let ingredient_id
      if (rows.length) {
        ingredient_id = rows[0].ingredient_id
      } else {
        const insertIng = await query(
          db,
          `INSERT INTO ingredients (ingredient_description)
           VALUES (?)`,
          [desc]
        )
        ingredient_id = insertIng.insertId
      }

      await query(
        db,
        `INSERT INTO recipe_ingredient
           (recipe_id, ingredient_id, ingredient_amount)
         VALUES (?, ?, ?)`,
        [recipe_id, ingredient_id, amt]
      )
    }

    res.json({ success: true, recipe_id })
  } catch (err) {
    console.error('Error updating recipe:', err)
    res.status(500).json({ error: 'Could not update recipe' })
  }

})

router.get('/small', optionalJWT, async (req, res) => {
  const db = req.db
  const currentUserId= req.user?.id ?? null;
  const { user_id, post_type, primary_spirit, search, sort} = req.query

  const params = [ currentUserId ];
  const filters = [];

  let sql = `
    SELECT r.recipe_id, r.recipe_title, r.recipe_image, r.like_count, r.post_time, r.primary_spirit, r.post_type, u.user_name, u.user_icon, u.user_id AS owner_id, CASE WHEN l.like_id IS NULL THEN FALSE ELSE TRUE END AS is_liked
    FROM recipes r JOIN users u ON r.user_id = u.user_id LEFT OUTER JOIN likes l ON r.recipe_id = l.recipe_id AND l.user_id = ?`

  if (user_id)        filters.push('r.user_id = ?') && params.push(user_id);
  if (post_type)      filters.push('r.post_type = ?') && params.push(post_type);
  if (primary_spirit) filters.push('r.primary_spirit = ?') && params.push(primary_spirit);

  if (search?.trim()) {
    filters.push('(r.recipe_title LIKE ? OR u.user_name LIKE ?)');
    const like = `%${search.trim()}%`;
    params.push(like, like);
  }

  if (filters.length) {
    sql += ' WHERE ' + filters.join(' AND ');
  }

  let order = 'r.post_time DESC';

  if (sort === 'oldest'){
    order = 'r.post_time ASC';
  } else if (sort === 'popular'){
    order = 'r.like_count DESC';
  }

  sql += ` ORDER BY ${order}`;

  try {
    const posts = await query(db, sql, params)
    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load posts' })
  }
});

router.get('/liked', verifyJWT, async (req, res) => {
  const db = req.db;
  const user_id = req.user.id;

  try{
    const posts = await query(db, 
      `SELECT r.recipe_id, r.recipe_title, r.recipe_image, r.like_count, r.post_time, u.user_name, u.user_icon, u.user_id AS owner_id, TRUE AS is_liked
      FROM recipes r
      JOIN likes l ON r.recipe_id = l.recipe_id AND l.user_id = ?
      JOIN users u ON r.user_id = u.user_id
      WHERE r.post_type = 'Public'
      ORDER BY r.post_time DESC`,
      [user_id]
    );

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Could not load liked posts"});
  }
})

router.get('/:recipe_id', optionalJWT, async (req, res) => {
  const db = req.db;
  const currentUserId = req.user?.id ?? null;
  const { recipe_id } = req.params;

  try{
    const [recipe] = await query(db,
        `SELECT r.recipe_id, r.recipe_title, r.primary_spirit, r.post_type, r.recipe_image, r.like_count, r.post_time, u.user_name, u.user_icon, u.user_id AS owner_id, CASE WHEN l.like_id IS NULL THEN FALSE ELSE TRUE END AS is_liked
        FROM recipes r
        NATURAL JOIN users u
        LEFT OUTER JOIN likes l
        ON r.recipe_id = l.recipe_id
        AND l.user_id = ?
        WHERE r.recipe_id = ?`,
        [currentUserId, recipe_id]
      );

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found'});
      }

      const directions = await query(db,
        `SELECT direction_description as dir
        FROM directions
        WHERE recipe_id = ?`,
        [recipe_id]
      );

      const ingredients = await query(db, 
        `SELECT i.ingredient_description as ing, ri.ingredient_amount as amt
        FROM recipe_ingredient ri
        JOIN ingredients i
        ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?`,
        [recipe_id]
      );

      res.json({
        recipe_id: recipe.recipe_id,
        recipe_title: recipe.recipe_title,
        primary_spirit: recipe.primary_spirit,
        post_type: recipe.post_type,
        recipe_image: recipe.recipe_image,
        like_count: recipe.like_count,
        post_time: recipe.post_time,
        owner_id: recipe.owner_id,
        user_name: recipe.user_name,
        user_icon: recipe.user_icon,
        is_liked: recipe.is_liked,
        directions: directions.map(i => i.dir), 
        ingredients: ingredients.map(i => ({desc: i.ing, amt: i.amt}))});

  } catch (err) {
    console.error('Error fetching full post', err);
    res.status(500).json({error: 'Cound not find recipe'})

  }
});

router.delete('/delete/:id', verifyJWT, async (req, res) => {
  const db = req.db;
  const user_id = req.user.id;    
  const is_admin = req.user.is_admin;
  const recipe_id = req.params.id;

  try {
    const [post] = await query(db,
      `SELECT user_id AS owner_id
      FROM recipes WHERE recipe_id = ?`,
      [recipe_id]
    );

    if(!post){
      return res.status(404).json({error: 'Post not found'});
    }

    await query(db,
      `UPDATE users SET post_count = GREATEST(post_count - 1, 0) WHERE user_id = ?`,
      [post.owner_id]
    );

    await query(db,
      `DELETE FROM recipes WHERE recipe_id = ?`,
      [recipe_id]
    );
    return res.json({success: true})
  } catch (err) {
    console.error('Error deleting posts', err);
    return res.status(500).json({ error: 'Could not delete post' });
  }

});
module.exports = router;