// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User authentication routes (NEWLY ADDED)
router.post('/signup', userController.signup); // Route for user registration
router.post('/login', userController.login);   // Route for user login

// User profile routes
router.get('/:userId/profile', userController.getUserProfile);
router.put('/:userId/profile', userController.updateUserProfile);

// User collection routes
router.get('/:userId/collections', userController.getUserCollections);
router.post('/:userId/collections', userController.createCollection); // This route seems to add a new collection
// Note: If you intended to add a menu item to a user's *existing* collection
// using the top-level /collections endpoint, you might revisit this.
// The frontend currently uses POST /:userId/collections with a menuItemId.
// Let's adjust createCollection in controller to handle either new collection or adding to default.
router.post('/:userId/collections/:collectionId/menus', userController.addMenuToCollection);
router.delete('/:userId/collections/:collectionId', userController.deleteCollection);
router.delete('/:userId/collections/:collectionId/menus/:menuId', userController.removeMenuFromCollection);

module.exports = router;