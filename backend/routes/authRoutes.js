import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
} from "../middleware/authValidation.js";

import { handleValidationErrors } from "../middleware/validationMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  authLimiter,
  registerValidation,
  handleValidationErrors,
  registerUser
);

// Login
router.post(
  "/login",
  authLimiter,
  loginValidation,
  handleValidationErrors,
  loginUser
);

// Logout
router.post("/logout", protect, logoutUser);

// Current logged-in user
router.get("/me", protect, getCurrentUser);

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google-auth-failed`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  }
);

export default router;