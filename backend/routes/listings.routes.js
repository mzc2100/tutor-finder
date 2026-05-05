const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// GET all active listings with images
router.get('/', async (req, res) => {
  const [rows] = await db.query(
    `SELECT l.*, c.name AS category,
     (SELECT GROUP_CONCAT(image_path ORDER BY display_order SEPARATOR ',')
      FROM listing_images WHERE listing_id = l.id) AS images
     FROM listings l
     JOIN categories c ON l.category_id = c.id
     WHERE l.is_active = 1
     ORDER BY l.created_at DESC`
  );

  // Parse images array for each listing
  const listingsWithImages = rows.map(row => ({
    ...row,
    images: row.images ? row.images.split(',') : []
  }));

  res.json(listingsWithImages);
});

// SEARCH listings with images with pagination
router.get('/search', async (req, res) => {
  const { keyword, category, page = 1, limit = 20 } = req.query;

  // Parse and validate pagination parameters
  const pageNum = parseInt(page) || 1;
  const limitNum = Math.min(parseInt(limit) || 20, 100); // Max 100 items per page
  const offset = (pageNum - 1) * limitNum;

  let sql = `
    SELECT l.*, c.name AS category,
     (SELECT GROUP_CONCAT(image_path ORDER BY display_order SEPARATOR ',')
      FROM listing_images WHERE listing_id = l.id) AS images
    FROM listings l
    JOIN categories c ON l.category_id = c.id
    WHERE l.is_active = 1
  `;
  const params = [];

  if (keyword) {
    sql += ` AND (l.title LIKE ? OR l.location LIKE ?)`;
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  if (category) {
    sql += ` AND c.name = ?`;
    params.push(category);
  }

  // Get total count for pagination (separate query to avoid regex issues)
  let countSql = `SELECT COUNT(*) as total FROM listings l JOIN categories c ON l.category_id = c.id WHERE l.is_active = 1`;
  const countParams = [];
  
  if (keyword) {
    countSql += ` AND (l.title LIKE ? OR l.location LIKE ?)`;
    countParams.push(`%${keyword}%`, `%${keyword}%`);
  }
  
  if (category) {
    countSql += ` AND c.name = ?`;
    countParams.push(category);
  }
  
  const [countResult] = await db.query(countSql, countParams);
  const total = countResult[0].total;

  // Add pagination to main query
  sql += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  const [rows] = await db.query(sql, params);

  // Parse images array for each listing
  const listingsWithImages = rows.map(row => ({
    ...row,
    images: row.images ? row.images.split(',') : []
  }));

  res.json({
    data: listingsWithImages,
    pagination: {
      currentPage: pageNum,
      itemsPerPage: limitNum,
      totalItems: total,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

// CREATE phone request
router.post('/phone-request', async (req, res) => {
  const {
    listing_id,
    user_name,
    user_phone,
    user_description
  } = req.body;

  // Get listing title
  const [listing] = await db.query(
    `SELECT title FROM listings WHERE id = ?`,
    [listing_id]
  );

  if (!listing || listing.length === 0) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const [result] = await db.query(
    `INSERT INTO phone_requests
     (listing_id, listing_title, user_name, user_phone, description)
     VALUES (?, ?, ?, ?, ?)`,
    [listing_id, listing[0].title, user_name, user_phone, user_description]
  );

  res.json({ message: 'Phone request sent', id: result.insertId });
});

module.exports = router;