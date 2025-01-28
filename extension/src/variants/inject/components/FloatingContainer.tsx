import "@/index.css";
import React, { useState } from "react";
import { AppContent } from "../../../pages/shared/app-content";
import { X } from "lucide-react";

export const FloatingContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      <div className="floating-container">
        <div className="close-button" onClick={() => setIsVisible(false)}>
          <X size={20} />
        </div>
        <AppContent onClose={() => setIsVisible(false)} />
      </div>
    </>
  );
};
