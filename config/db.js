const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/madangae', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Verify collections exist
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    await createInitialAdmin();
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const createInitialAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        name: 'Super Admin',
        email: 'admin@madangae.com',
        password: hashedPassword,
        role: 'Super Admin'
      });
      console.log('Initial admin created');
    } else {
      console.log('Admin already exists, skipping creation');
    }
  } catch (err) {
    console.error('Error creating initial admin:', err);
  }
};

module.exports = connectDB;