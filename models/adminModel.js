// models/adminModel.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In a real app, hash this!
  role: { type: String, default: 'Admin' },
  profilePicture: { type: String, default: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=ADM' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update 'updatedAt' timestamp on save
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Admin', adminSchema);