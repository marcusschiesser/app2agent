import { useState } from "react";
import { Mode, useConfig } from "@/hooks/use-config";

export interface FeedbackProps {
  onSubmit?: (rating: "good" | "neutral" | "bad") => void;
}

export function Feedback({ onSubmit }: FeedbackProps) {
  const { mode } = useConfig();
  const [selectedRating, setSelectedRating] = useState<
    "good" | "neutral" | "bad" | null
  >(null);

  const handleRatingClick = (rating: "good" | "neutral" | "bad") => {
    setSelectedRating(rating);
    onSubmit?.(rating);
  };

  return (
    <div className="mt-4 px-4 pt-3 pb-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-medium mb-3">
        {mode === Mode.Tutor
          ? "How was the interaction?"
          : "How was your call?"}
      </h3>
      <div className="flex justify-center gap-6">
        <button
          onClick={() => handleRatingClick("good")}
          className={`rounded-full hover:bg-gray-100 transition-colors ${
            selectedRating === "good" ? "bg-gray-100" : ""
          }`}
          aria-label="Good"
        >
          <span className="text-2xl">😊</span>
        </button>
        <button
          onClick={() => handleRatingClick("neutral")}
          className={`rounded-full hover:bg-gray-100 transition-colors ${
            selectedRating === "neutral" ? "bg-gray-100" : ""
          }`}
          aria-label="Neutral"
        >
          <span className="text-2xl">😐</span>
        </button>
        <button
          onClick={() => handleRatingClick("bad")}
          className={`rounded-full hover:bg-gray-100 transition-colors ${
            selectedRating === "bad" ? "bg-gray-100" : ""
          }`}
          aria-label="Bad"
        >
          <span className="text-2xl">☹️</span>
        </button>
      </div>
    </div>
  );
}
