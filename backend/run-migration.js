const db = require('./db/mysql');

const runMigration = async () => {
  try {
    console.log('Starting database migration...\n');

    // Add phone_visibility column to listings table
    console.log('1. Adding phone_visibility column to listings table...');
    try {
      await db.query(`
        ALTER TABLE listings 
        ADD COLUMN IF NOT EXISTS phone_visibility ENUM('show', 'request') DEFAULT 'show'
      `);
      console.log('✓ phone_visibility column added (or already exists)\n');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ phone_visibility column already exists\n');
      } else {
        throw err;
      }
    }

    // Create phone_requests table
    console.log('2. Creating phone_requests table...');
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS phone_requests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          listing_id INT NOT NULL,
          listing_title VARCHAR(255) NOT NULL,
          user_name VARCHAR(255) NOT NULL,
          user_phone VARCHAR(20) NOT NULL,
          description TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
        )
      `);
      console.log('✓ phone_requests table created (or already exists)\n');
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('✓ phone_requests table already exists\n');
      } else {
        throw err;
      }
    }

    console.log('Migration completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Create listings with phone visibility option');
    console.log('2. Users can request phone numbers from listings');
    console.log('3. View and manage phone requests in admin panel');

  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error('\nPlease check:');
    console.log('1. MySQL is running');
    console.log('2. Database connection is correct');
    console.log('3. You have proper database permissions');
    process.exit(1);
  } finally {
    await db.end();
  }
};

runMigration();