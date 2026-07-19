import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeGuestReview = async (reviewText) => {
  if (!reviewText || !reviewText.trim()) {
    throw new Error("Review text is required");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from the environment");
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
Analyze the following homestay guest review.

Guest review:
"${reviewText.trim()}"

Tasks:
1. Classify the sentiment as exactly one of:
   Positive, Neutral, Negative

2. Identify the main theme as exactly one of:
   Cleanliness, Food, Host, Location, Value, Experience

3. Provide a confidence score between 0 and 100.

4. Write a polite one-line response from homestay management.
The response must acknowledge the guest's feedback and match the sentiment.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ["Positive", "Neutral", "Negative"],
            },
            theme: {
              type: Type.STRING,
              enum: [
                "Cleanliness",
                "Food",
                "Host",
                "Location",
                "Value",
                "Experience",
              ],
            },
            confidence: {
              type: Type.NUMBER,
            },
            response: {
              type: Type.STRING,
            },
          },
          required: [
            "sentiment",
            "theme",
            "confidence",
            "response",
          ],
        },
      },
    });

    const rawText = result.text;

    if (!rawText) {
      throw new Error("Gemini returned an empty response");
    }

    const analysis = JSON.parse(rawText);

    return {
      sentiment: analysis.sentiment,
      theme: analysis.theme,
      confidence: Math.round(
        Math.min(100, Math.max(0, Number(analysis.confidence) || 0))
      ),
      response: analysis.response,
    };
  } catch (error) {
    console.error("Gemini analysis error:", error.message);

    if (error.status === 429) {
      throw new Error(
        "The AI service rate limit has been reached. Please try again shortly."
      );
    }

    if (error.status === 401 || error.status === 403) {
      throw new Error(
        "The Gemini API key is invalid or does not have permission."
      );
    }

    throw new Error(
      error.message || "Unable to analyze the review using Gemini"
    );
  }
};