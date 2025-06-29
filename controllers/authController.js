const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (admin, statusCode, req, res) => {
  const token = signToken(admin._id, admin.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'Strict'
  };

  res.cookie('jwt', token, cookieOptions);
  admin.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    admin
  });
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    createSendToken(admin, 200, req, res);
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Login failed' });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({ status: 'fail', message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Admin'
    });

    createSendToken(newAdmin, 201, req, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1] || req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentAdmin = await Admin.findById(decoded.id);

    if (!currentAdmin) {
      return res.status(401).json({ status: 'fail', message: 'Admin not found' });
    }

    req.admin = currentAdmin;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission' });
    }
    next();
  };
};
