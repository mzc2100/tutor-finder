const express = require('express');
const router = express.Router();
const db = require('../db/mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
    }
  }
});


// top of admin.routes.js
/*router.use((req, res, next) => {
  if (req.headers['x-admin-key'] !== 'SECRET123') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}); 
*/

/**
 * CREATE listing with images
 */
router.post('/listings', upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      price,
      rate_type,
      location,
      phone,
      phone_visibility
    } = req.body;

    // Insert listing
    const [result] = await db.query(
      `INSERT INTO listings
       (title, description, category_id, price, rate_type, location, phone, phone_visibility)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category_id, price, rate_type || 'month', location, phone, phone_visibility || 'show']
    );

    const listingId = result.insertId;
    const files = req.files || [];

    // If images were uploaded, handle them
    if (files.length > 0) {
      // Set first image as main image
      const mainImage = files[0].filename;
      await db.query(
        `UPDATE listings SET main_image = ? WHERE id = ?`,
        [mainImage, listingId]
      );

      // Insert all images into listing_images table
      for (let i = 0; i < files.length; i++) {
        await db.query(
          `INSERT INTO listing_images (listing_id, image_path, display_order)
           VALUES (?, ?, ?)`,
          [listingId, files[i].filename, i]
        );
      }
    }

    res.json({ 
      message: 'Listing created', 
      id: listingId,
      main_image: files.length > 0 ? files[0].filename : null,
      images_count: files.length
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    // If there was an error, delete uploaded files
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join('uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

/**
 * UPDATE listing with images
 */
router.put('/listings/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      rate_type,
      location,
      phone,
      phone_visibility,
      is_active,
      delete_existing_images
    } = req.body;

    // Update listing details
    await db.query(
      `UPDATE listings
       SET title=?, description=?, price=?, rate_type=?, location=?, phone=?, phone_visibility=?, is_active=?
       WHERE id=?`,
      [title, description, price, rate_type || 'month', location, phone, phone_visibility || 'show', is_active, id]
    );

    const files = req.files || [];

    // Handle image updates
    if (files.length > 0) {
      // If requested to delete existing images, remove them
      if (delete_existing_images === 'true') {
        // Get existing images
        const [existingImages] = await db.query(
          `SELECT image_path FROM listing_images WHERE listing_id = ?`,
          [id]
        );

        // Delete files from filesystem
        existingImages.forEach(img => {
          const filePath = path.join('uploads', img.image_path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });

        // Delete from database
        await db.query(`DELETE FROM listing_images WHERE listing_id = ?`, [id]);
        await db.query(`UPDATE listings SET main_image = NULL WHERE id = ?`, [id]);
      }

      // Set first new image as main image
      const mainImage = files[0].filename;
      await db.query(
        `UPDATE listings SET main_image = ? WHERE id = ?`,
        [mainImage, id]
      );

      // Insert new images
      for (let i = 0; i < files.length; i++) {
        await db.query(
          `INSERT INTO listing_images (listing_id, image_path, display_order)
           VALUES (?, ?, ?)`,
          [id, files[i].filename, i]
        );
      }
    }

    res.json({ 
      message: 'Listing updated',
      images_uploaded: files.length
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    // If there was an error, delete newly uploaded files
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join('uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

/**
 * DELETE listing (soft delete)
 */
router.delete('/listings/:id', async (req, res) => {
  const { id } = req.params;

  // Delete associated images from filesystem
  const [images] = await db.query(
    `SELECT image_path FROM listing_images WHERE listing_id = ?`,
    [id]
  );

  images.forEach(img => {
    const filePath = path.join('uploads', img.image_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  // Soft delete listing (images will be deleted from DB by CASCADE)
  await db.query(
    `UPDATE listings SET is_active=0 WHERE id=?`,
    [id]
  );

  res.json({ message: 'Listing deactivated' });
});

/**
 * GET all listings (admin view) with images
 */
router.get('/listings', async (req, res) => {
  const [rows] = await db.query(
    `SELECT l.*, c.name AS category,
     (SELECT GROUP_CONCAT(image_path ORDER BY display_order SEPARATOR ',')
      FROM listing_images WHERE listing_id = l.id) AS images
     FROM listings l
     JOIN categories c ON l.category_id = c.id
     ORDER BY l.created_at DESC`
  );

  // Parse images array for each listing
  const listingsWithImages = rows.map(row => ({
    ...row,
    images: row.images ? row.images.split(',') : []
  }));

  res.json(listingsWithImages);
});

/**
 * GET all phone requests
 */
router.get('/phone-requests', async (req, res) => {
  const [rows] = await db.query(
    `SELECT * FROM phone_requests ORDER BY created_at DESC`
  );

  res.json(rows);
});

/**
 * DELETE phone request
 */
router.delete('/phone-requests/:id', async (req, res) => {
  const { id } = req.params;

  await db.query(
    `DELETE FROM phone_requests WHERE id=?`,
    [id]
  );

  res.json({ message: 'Phone request deleted' });
});

module.exports = router;