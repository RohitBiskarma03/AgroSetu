// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const dealerRoutes = require('./routes/dealer');
const farmerRoutes = require('./routes/farmer');
const deliveryRoutes = require('./routes/delivery');
const { authMiddleware } = require('./middleware/auth');
const aiAdvisoryRoutes = require('./routes/aiAdvisoryRoutes');
const carbonCreditRoutes = require('./routes/carbonCreditRoutes');
const organicFarmingRoutes = require('./routes/organicFarmingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/agrosetu', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.use('/auth', authRoutes);
app.use('/admin', authMiddleware, adminRoutes);
app.use('/dealer', authMiddleware, dealerRoutes);
app.use('/farmer', authMiddleware, farmerRoutes);
app.use('/delivery', authMiddleware, deliveryRoutes);
app.use('/ai', authMiddleware, aiAdvisoryRoutes);
app.use('/carbon-credits', authMiddleware, carbonCreditRoutes);
app.use('/organic-farming', authMiddleware, organicFarmingRoutes);
app.use('/notifications', authMiddleware, notificationRoutes);

app.listen(3000, () => {
  console.log('AgroSetuFarmFix backend running on port 3000');
});



