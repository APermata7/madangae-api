// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// User-facing menu routes
router.get('/', menuController.getAllMenus); // Get all menus
router.get('/recommended', menuController.getRecommendedMenus); // Get recommended menus
router.get('/search', menuController.searchMenus); // Search menus
router.get('/:id', menuController.getMenuById); // Get single menu by ID

module.exports = router;