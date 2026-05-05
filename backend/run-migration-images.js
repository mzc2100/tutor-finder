const db = require('./db/mysql');
const fs = require('fs');

async function runMigration() {
  console.log('Starting image support migration...');
  
  try {
    // Add main_image column to listings table
    console.log('Adding main_image column to listings table...');
    await db.query(`
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS main_image VARCHAR(255) DEFAULT NULL
    `);
    console.log('✓ main_image column added');

    // Create listing_images table
    console.log('Creating listing_images table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS listing_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        listing_id INT NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ listing_images table created');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️  Column or table already exists, skipping...');
      console.log('\n✅ Migration completed (skipped existing items)!');
    } else {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  }
  
  process.exit(0);
}

runMigration();