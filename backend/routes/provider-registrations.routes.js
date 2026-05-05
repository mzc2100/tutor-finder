const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db/mysql');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images for NID photo and PDF/DOC for CV
    const allowedTypesNID = /jpeg|jpg|png|gif/;
    const allowedTypesCV = /pdf|doc|docx/;
    
    if (file.fieldname === 'nid_photo' && allowedTypesNID.test(file.mimetype)) {
      cb(null, true);
    } else if (file.fieldname === 'cv' && allowedTypesCV.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Create a new provider registration
router.post('/', upload.fields([
  { name: 'nid_photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  try {
    const { full_name, mobile_number, address, category, reference_number, other_notes } = req.body;
    
    const nid_photo_path = req.files['nid_photo'] ? req.files['nid_photo'][0].filename : null;
    const cv_path = req.files['cv'] ? req.files['cv'][0].filename : null;

    const query = `
      INSERT INTO provider_registrations 
      (full_name, mobile_number, address, category, nid_photo_path, cv_path, reference_number, other_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      full_name,
      mobile_number,
      address,
      category,
      nid_photo_path,
      cv_path,
      reference_number,
      other_notes
    ]);

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit registration',
      error: error.message
    });
  }
});

// Get all provider registrations (admin only)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT * FROM provider_registrations 
      ORDER BY created_at DESC
    `;

    const [registrations] = await db.query(query);

    // Add full URLs for files
    const baseUrl = req.protocol + '://' + req.get('host');
    const formattedRegistrations = registrations.map(reg => ({
      ...reg,
      nid_photo_url: reg.nid_photo_path ? `${baseUrl}/uploads/${reg.nid_photo_path}` : null,
      cv_url: reg.cv_path ? `${baseUrl}/uploads/${reg.cv_path}` : null
    }));

    res.status(200).json(formattedRegistrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
});

// Get a single registration by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM provider_registrations WHERE id = ?';

    const [registrations] = await db.query(query, [id]);

    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const registration = registrations[0];
    registration.nid_photo_url = registration.nid_photo_path ? `${baseUrl}/uploads/${registration.nid_photo_path}` : null;
    registration.cv_url = registration.cv_path ? `${baseUrl}/uploads/${registration.cv_path}` : null;

    res.status(200).json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration',
      error: error.message
    });
  }
});

// Update registration status (approve/reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const query = `
      UPDATE provider_registrations 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    await db.query(query, [status, id]);

    res.status(200).json({
      success: true,
      message: `Registration ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating registration status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration',
      error: error.message
    });
  }
});

// Delete a registration
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM provider_registrations WHERE id = ?';

    await db.query(query, [id]);

    res.status(200).json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete registration',
      error: error.message
    });
  }
});

module.exports = router;