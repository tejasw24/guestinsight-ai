import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review text is required"],
            trim: true,
            maxlength: [1000, "Review cannot exceed 1000 characters"],
        },

        sentiment: {
            type: String,
            required: [true, "Sentiment is required"],
            enum: {
                values: ["Positive", "Neutral", "Negative"],
                message: "Sentiment must be Positive, Neutral, or Negative",
            },
        },

        theme: {
            type: String,
            required: [true, "Theme is required"],
            enum: {
                values: [
                    "Cleanliness",
                    "Food",
                    "Host",
                    "Location",
                    "Value",
                    "Experience",
                ],
                message: "Invalid review theme",
            },
        },

        confidence: {
            type: Number,
            required: [true, "Confidence score is required"],
            min: [0, "Confidence cannot be below 0"],
            max: [100, "Confidence cannot exceed 100"],
        },

        response: {
            type: String,
            required: [true, "Management response is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;