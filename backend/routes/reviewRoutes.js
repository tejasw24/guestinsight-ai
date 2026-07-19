import express from "express";

import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  searchReviews,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Any logged-in user can read and create reviews
router.get("/search", protect, searchReviews);
router.get("/", protect, getAllReviews);
router.get("/:id", protect, getReviewById);
router.post("/", protect, createReview);

// Only admin can update or delete reviews
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;