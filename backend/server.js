const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rentalController = require('./controllers/rentalController');
const authMiddleware = require('./middleware/auth');
const config = require('./config/keys');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/api/rentals/create', authMiddleware, rentalController.createRentalProperty);
app.post('/api/rentals/agreement', authMiddleware, rentalController.createRentalAgreement);
app.post('/api/rentals/payrent', authMiddleware, rentalController.payRent);
app.post('/api/rentals/payrent-token', authMiddleware, rentalController.payRentWithToken);

// Database connection
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
