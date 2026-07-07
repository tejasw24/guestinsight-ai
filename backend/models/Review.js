import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: true,
        },
        sentiment: {
            type: String,
            required: true,
            enum: ["Positive", "Neutral", "Negative"],
        },
        theme: {
            type: String,
            required: true,
        },
        response: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;