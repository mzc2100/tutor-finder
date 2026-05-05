const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

// Serve static files from uploads directory
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/backend', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API running (apis route)'
  });
});
const listingRoutes = require('./routes/listings.routes');
app.use('/backend/listings', listingRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/backend/admin', adminRoutes);

const providerRegistrationsRoutes = require('./routes/provider-registrations.routes');
app.use('/backend/provider-registrations', providerRegistrationsRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
