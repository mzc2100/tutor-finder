const db = require('./db/mysql');

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS provider_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    nid_photo_path VARCHAR(255),
    cv_path VARCHAR(255),
    reference_number VARCHAR(50),
    other_notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

db.query(createTableSQL)
  .then(() => {
    console.log('Provider registrations table created successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error creating table:', err.message);
    process.exit(1);
  });