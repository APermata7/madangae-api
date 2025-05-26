// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const menuController = require('../controllers/menuController'); // Admin also manages menus

// Admin dashboard routes
router.get('/dashboard', adminController.getDashboardStats);

// Admin menu management routes
router.get('/menus', menuController.getAllMenus); // Admin can also get all menus
router.post('/menus', menuController.addMenu);
router.put('/menus/:id', menuController.updateMenu);
router.delete('/menus/:id', menuController.deleteMenu);

// Admin profile routes
router.get('/:adminId/profile', adminController.getAdminProfile);
router.put('/:adminId/profile', adminController.updateAdminProfile);

module.exports = router;