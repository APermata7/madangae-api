// backend/models/Collection.js
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the 'User' model
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: 'My Favorites', // A default name if one isn't provided
  },
  menuItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu', // This references the 'Menu' model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Collection', collectionSchema);