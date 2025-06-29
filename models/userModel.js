const mongoose = require('mongoose');

// Subschema untuk collections milik user
const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  menus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }]
}, { _id: true }); // biar tiap collection ada _id-nya

// Schema utama user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'https://placehold.co/100x100/FFD700/000000?text=User'
  },
  bio: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date,
    default: null
  },
  collections: [collectionSchema]
}, { 
  timestamps: true // otomatis buat createdAt & updatedAt
});

// Middleware untuk update updatedAt sebelum save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
