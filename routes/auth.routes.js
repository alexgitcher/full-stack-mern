import { Router } from "express";
import bcrypt from 'bcryptjs';
import { check, validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import config from 'config';

import User from '../models/User.js';

const router = Router();

const JWT_SECRET = config.get('jwtSecret');

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Wrong email').isEmail(),
    check('password', 'Password must be at least 6 characters long')
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data',
        });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({
          message: 'User is already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({
        message: 'User has been created'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong. Please, try again.'
      });
    }
});

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Enter correct email').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login data',
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: 'User not found',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: 'Incorrect password, try again'
        });
      }

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '1h'},
      );

      res.json({
        token,
        userId: user.id,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong. Please, try again.'
      });
    }
});

export default router;
