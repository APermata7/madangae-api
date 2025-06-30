const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const validateMiddleware = require('../middlewares/validateMiddleware');

// User authentication routes dengan validasi input
router.post(
  '/signup',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validateMiddleware, 
  userController.signup
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  validateMiddleware,
  userController.login
);

// User profile routes
router.get('/:userId/profile', userController.getUserProfile);
router.put('/:userId/profile', userController.updateUserProfile);

// User collection routes
router.get('/:userId/collections', userController.getUserCollections);
router.post('/:userId/collections', userController.createCollection); 
router.delete('/:userId/collections/:menuItemId', userController.removeMenuItemSimple);
router.post('/:userId/collections/:collectionId/menus', userController.addMenuToCollection);
router.delete('/:userId/collections/:collectionId', userController.deleteCollection);
router.delete('/:userId/collections/:collectionId/menus/:menuId', userController.removeMenuFromCollection);

module.exports = router;