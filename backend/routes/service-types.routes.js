const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// Get all service types
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, name, display_name, icon, is_active, sort_order
      FROM service_types
      WHERE is_active = 1
      ORDER BY sort_order ASC, display_name ASC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching service types:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service types' });
  }
});

// Get service type by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      'SELECT id, name, display_name, icon, is_active, sort_order FROM service_types WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service type not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching service type:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service type' });
  }
});

// Create new service type
router.post('/', async (req, res) => {
  try {
    const { name, display_name, icon, sort_order } = req.body;
    
    // Validation
    if (!name || !display_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and display_name are required' 
      });
    }
    
    // Check if name already exists
    const [existing] = await db.execute(
      'SELECT id FROM service_types WHERE name = ?',
      [name]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Service type with this name already exists' 
      });
    }
    
    const [result] = await db.execute(
      'INSERT INTO service_types (name, display_name, icon, sort_order) VALUES (?, ?, ?, ?)',
      [name, display_name, icon || null, sort_order || 0]
    );
    
    res.json({ 
      success: true, 
      message: 'Service type created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating service type:', error);
    res.status(500).json({ success: false, message: 'Failed to create service type' });
  }
});

// Update service type
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, display_name, icon, is_active, sort_order } = req.body;
    
    // Check if service type exists
    const [existing] = await db.execute(
      'SELECT id FROM service_types WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service type not found' });
    }
    
    // Check if name already exists (excluding current record)
    if (name) {
      const [duplicate] = await db.execute(
        'SELECT id FROM service_types WHERE name = ? AND id != ?',
        [name, id]
      );
      
      if (duplicate.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Service type with this name already exists' 
        });
      }
    }
    
    await db.execute(
      `UPDATE service_types 
       SET name = COALESCE(?, name),
           display_name = COALESCE(?, display_name),
           icon = COALESCE(?, icon),
           is_active = COALESCE(?, is_active),
           sort_order = COALESCE(?, sort_order)
       WHERE id = ?`,
      [name, display_name, icon, is_active, sort_order, id]
    );
    
    res.json({ success: true, message: 'Service type updated successfully' });
  } catch (error) {
    console.error('Error updating service type:', error);
    res.status(500).json({ success: false, message: 'Failed to update service type' });
  }
});

// Delete service type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if service type exists
    const [existing] = await db.execute(
      'SELECT id FROM service_types WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service type not found' });
    }
    
    // Soft delete by setting is_active to 0
    await db.execute(
      'UPDATE service_types SET is_active = 0 WHERE id = ?',
      [id]
    );
    
    res.json({ success: true, message: 'Service type deleted successfully' });
  } catch (error) {
    console.error('Error deleting service type:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service type' });
  }
});

module.exports = router;