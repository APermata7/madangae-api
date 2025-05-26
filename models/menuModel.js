// models/menuModel.js
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: 'https://placehold.co/600x400/FFD700/000000?text=No+Image' },
  ingredients: [{ type: String }], // Array of strings
  tutorial: [{ type: String }],    // Array of strings
  rating: { type: Number, min: 0, max: 5, default: 0 }, // For user FE recommendations
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update 'updatedAt' timestamp on save
menuSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Menu', menuSchema);