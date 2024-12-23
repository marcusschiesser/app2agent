import { useState } from "react";

export interface FeedbackProps {
  onSubmit?: (rating: "good" | "neutral" | "bad") => void;
}

export function Feedback({ onSubmit }: FeedbackProps) {
  const [selectedRating, setSelectedRating] = useState<
    "good" | "neutral" | "bad" | null
  >(null);

  const handleRatingClick = (rating: "good" | "neutral" | "bad") => {
    setSelectedRating(rating);
    onSubmit?.(rating);
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-3">How was your call?</h3>
      <div className="flex justify-center gap-6">
        <button
          onClick={() => handleRatingClick("good")}
          className={`p-3 rounded-full hover:bg-gray-100 transition-colors ${
            selectedRating === "good" ? "bg-gray-100" : ""
          }`}
          aria-label="Good"
        >
          <span className="text-3xl">😊</span>
        </button>
        <button
          onClick={() => handleRatingClick("neutral")}
          className={`p-3 rounded-full hover:bg-gray-100 transition-colors ${
            selectedRating === "neutral" ? "bg-gray-100" : ""
          }`}
          aria-label="Neutral"
        >
          <span className="text-3xl">😐</span>
        </button>
        <button
          onClick={() => handleRatingClick("bad")}
          className={`p-3 rounded-full hover:bg-gray-100 transition-colors ${
            selectedRating === "bad" ? "bg-gray-100" : ""
          }`}
          aria-label="Bad"
        >
          <span className="text-3xl">☹️</span>
        </button>
      </div>
    </div>
  );
}
