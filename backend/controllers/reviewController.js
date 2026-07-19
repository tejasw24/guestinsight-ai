import mongoose from "mongoose";
import Review from "../models/Review.js";

const isValidReviewId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// GET /api/reviews/:id
export const getReviewById = async (req, res) => {
  try {
    if (!isValidReviewId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Get review error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch review",
    });
  }
};

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const {
      review,
      sentiment,
      theme,
      confidence,
      response,
    } = req.body;

    if (
      !review?.trim() ||
      !sentiment ||
      !theme ||
      confidence === undefined ||
      confidence === null ||
      !response?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Review, sentiment, theme, confidence, and response are required",
      });
    }

    const parsedConfidence = Number(confidence);

    if (
      Number.isNaN(parsedConfidence) ||
      parsedConfidence < 0 ||
      parsedConfidence > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Confidence must be a number between 0 and 100",
      });
    }

    const newReview = await Review.create({
      review: review.trim(),
      sentiment,
      theme,
      confidence: Math.round(parsedConfidence),
      response: response.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Create review error:", error.message);

    if (error.name === "ValidationError") {
      const validationMessage = Object.values(error.errors)
        .map((item) => item.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

// PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    if (!isValidReviewId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const allowedFields = [
      "review",
      "sentiment",
      "theme",
      "confidence",
      "response",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.review !== undefined) {
      updateData.review = String(updateData.review).trim();
    }

    if (updateData.response !== undefined) {
      updateData.response = String(updateData.response).trim();
    }

    if (updateData.confidence !== undefined) {
      const parsedConfidence = Number(updateData.confidence);

      if (
        Number.isNaN(parsedConfidence) ||
        parsedConfidence < 0 ||
        parsedConfidence > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Confidence must be a number between 0 and 100",
        });
      }

      updateData.confidence = Math.round(parsedConfidence);
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error.message);

    if (error.name === "ValidationError") {
      const validationMessage = Object.values(error.errors)
        .map((item) => item.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    if (!isValidReviewId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const deletedReview = await Review.findByIdAndDelete(
      req.params.id
    );

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

// GET /api/reviews/search?q=food
export const searchReviews = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await Review.find({
      $or: [
        {
          review: {
            $regex: query,
            $options: "i",
          },
        },
        {
          sentiment: {
            $regex: query,
            $options: "i",
          },
        },
        {
          theme: {
            $regex: query,
            $options: "i",
          },
        },
        {
          response: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Search reviews error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};