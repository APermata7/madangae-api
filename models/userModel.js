// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: 'https://placehold.co/100x100/FFD700/000000?text=User' },
  bio: { type: String, default: '' },
  lastLogin: { type: Date, default: null },
  collections: [{
    name: { type: String, required: true },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);