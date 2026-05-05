#!/bin/bash

echo "Starting database migration..."

# Check if MySQL is running
if ! mysqladmin ping -h localhost --silent; then
    echo "MySQL is not running. Please start MySQL first."
    echo "Try: brew services start mysql"
    exit 1
fi

# Add phone_visibility column to listings table
echo "Adding phone_visibility column to listings table..."
mysql -u root -p123456 tutor_finder <<EOF
ALTER TABLE listings ADD COLUMN IF NOT EXISTS phone_visibility ENUM('show', 'request') DEFAULT 'show';
EOF

if [ $? -eq 0 ]; then
    echo "✓ phone_visibility column added (or already exists)"
else
    echo "✗ Failed to add phone_visibility column"
fi

# Create phone_requests table
echo "Creating phone_requests table..."
mysql -u root -p123456 tutor_finder <<EOF
CREATE TABLE IF NOT EXISTS phone_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  listing_title VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
EOF

if [ $? -eq 0 ]; then
    echo "✓ phone_requests table created (or already exists)"
else
    echo "✗ Failed to create phone_requests table"
fi

echo ""
echo "Migration completed!"
echo ""
echo "You can now:"
echo "1. Restart the backend server"
echo "2. Create listings with phone visibility option"
echo "3. Users can request phone numbers from listings"