// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import DB connection

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to Database
connectDB();

// Express App Setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Body parser for JSON requests

// --- News Data (Static for this demo, can be dynamic in a real app) ---
const newsData = [
  { id: 'news1', title: 'Tren Makanan Sehat 2025: Lebih Banyak Tanpa Daging', date: '2025-05-20', snippet: 'Temukan berbagai tren makanan sehat yang akan populer di tahun 2025, dengan fokus pada opsi nabati dan bahan-bahan lokal.' },
  { id: 'news2', title: 'Festival Kuliner Nusantara Kembali Hadir!', date: '2025-05-15', snippet: 'Jangan lewatkan festival kuliner terbesar yang menampilkan hidangan dari seluruh Indonesia, dari Sabang sampai Merauke.' },
  { id: 'news3', title: 'Tips Memasak Hemat di Akhir Bulan', date: '2025-05-10', snippet: 'Pelajari cara membuat hidangan lezat dan bergizi dengan anggaran terbatas, cocok untuk akhir bulan.' },
  { id: 'news4', title: 'Manfaat Rempah-rempah dalam Masakan Indonesia', date: '2025-05-05', snippet: 'Gali lebih dalam tentang khasiat kesehatan dan cita rasa unik yang ditawarkan rempah-rempah khas Indonesia.' },
];

app.get('/api/news', (req, res) => {
  res.status(200).json(newsData);
});

// Use routes
app.use('/api/menus', menuRoutes); // User-facing menu routes
app.use('/api/users', userRoutes); // User-specific routes
app.use('/api/admin', adminRoutes); // Admin-specific routes

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access User FE at: http://localhost:3000 (after running user FE)`);
  console.log(`Access Admin FE at: http://localhost:3001 (after running admin FE)`);
  console.log(`Backend API at: http://localhost:${PORT}/api`);
});