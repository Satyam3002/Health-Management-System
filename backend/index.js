const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const express = require('express')
const app = express();

// Middleware
app.use(express.json());
app.use(cors())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/health-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes')
const roomRoutes = require('./routes/roomRoute')
const appointmentRoutes = require('./routes/appointmentRoutes')

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1', roomRoutes)
app.use('/api/v1/appointments', appointmentRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)})
