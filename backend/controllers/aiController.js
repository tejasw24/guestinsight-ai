import { analyzeGuestReview } from "../services/geminiService.js";

export const analyzeReview = async (req, res) => {
  try {
    const { review } = req.body;

    if (!review || !review.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review text is required",
      });
    }

    const result = await analyzeGuestReview(review);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};