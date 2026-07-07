import Review from "../models/Review.js";

// GET /api/reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// GET /api/reviews/:id
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
  }
};

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { review, sentiment, theme, response } = req.body;

    if (!review || !sentiment || !theme || !response) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newReview = await Review.create({
      review,
      sentiment,
      theme,
      response,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

// PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

// GET /api/reviews/search?q=food
export const searchReviews = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await Review.find({
      $or: [
        { review: { $regex: query, $options: "i" } },
        { sentiment: { $regex: query, $options: "i" } },
        { theme: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};