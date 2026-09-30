require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware 
app.use(cors());
app.use(express.json());

// Routes — import and use auth routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'StoreRate API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
