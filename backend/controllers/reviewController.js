import reviews from "../data/reviews.js";

// GET /api/reviews
export const getAllReviews = (req, res) => {
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
};

// GET /api/reviews/:id
export const getReviewById = (req, res) => {
  const id = Number(req.params.id);
  const review = reviews.find((item) => item.id === id);

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
};

// POST /api/reviews
export const createReview = (req, res) => {
  const { review, sentiment, theme, response } = req.body;

  if (!review || !sentiment || !theme || !response) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const newReview = {
    id: reviews.length + 1,
    review,
    sentiment,
    theme,
    response,
  };

  reviews.push(newReview);

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: newReview,
  });
};

// PUT /api/reviews/:id
export const updateReview = (req, res) => {
  const id = Number(req.params.id);
  const reviewIndex = reviews.findIndex((item) => item.id === id);

  if (reviewIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    ...req.body,
  };

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: reviews[reviewIndex],
  });
};

// DELETE /api/reviews/:id
export const deleteReview = (req, res) => {
  const id = Number(req.params.id);
  const reviewIndex = reviews.findIndex((item) => item.id === id);

  if (reviewIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  reviews.splice(reviewIndex, 1);

  res.status(204).send();
};

// GET /api/reviews/search?q=food
export const searchReviews = (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const results = reviews.filter(
    (item) =>
      item.review.toLowerCase().includes(query.toLowerCase()) ||
      item.theme.toLowerCase().includes(query.toLowerCase()) ||
      item.sentiment.toLowerCase().includes(query.toLowerCase())
  );

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
};