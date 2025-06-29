const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const menuController = require('../controllers/menuController');
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const validate = require('../middlewares/validateMiddleware');

// Public routes
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.loginAdmin
);

router.post(
  '/register',
  [
    body('name').trim().notEmpty().escape().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must contain uppercase, lowercase, number and special char'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Password confirmation mismatch');
      return true;
    })
  ],
  validate,
  authController.registerAdmin
);

// CSRF token refresh endpoint — ambil dari req.csrfToken()
router.get('/csrf-token', (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: false // biar bisa diakses di frontend via js-cookie
  });
  res.status(200).json({ csrfToken: token });
});

// Logout endpoint
router.post('/logout', authController.protect, (req, res) => {
  res.clearCookie('XSRF-TOKEN');
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
});

// Protected routes
router.use(authController.protect);
router.use(authController.restrictTo('Admin', 'Super Admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Menu management
router.get('/menus', menuController.getAllMenus);
router.post(
  '/menus',
  [
    body('name').trim().notEmpty().escape(),
    body('description').trim().notEmpty().escape(),
    body('ingredients').isArray({ min: 1 }),
    body('tutorial').isArray({ min: 1 })
  ],
  validate,
  menuController.addMenu
);
router.put('/menus/:id', menuController.updateMenu);
router.delete(
  '/menus/:id',
  (req, res, next) => {
    if (!/^[a-f0-9]{24}$/.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    next();
  },
  menuController.deleteMenu
);

// Profile management
router.get('/profile', adminController.getAdminProfile);
router.put(
  '/profile',
  [
    body('name').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail()
  ],
  validate,
  adminController.updateAdminProfile
);

module.exports = router;
