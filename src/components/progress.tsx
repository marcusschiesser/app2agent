import React from "react";
import ReactDOM from "react-dom/client";
import { Modal } from "./modal";

function Progress() {
  return (
    <Modal>
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="text-lg font-semibold">Improving your text...</div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 w-1/3 animate-[progress_1.5s_ease-in-out_infinite]"
            style={{
              animation: "progress 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

let cleanup: (() => void) | null = null;

export function showProgress(progressRoot: ReactDOM.Root) {
  progressRoot.render(
    <React.StrictMode>
      <Progress />
    </React.StrictMode>,
  );

  cleanup = () => {
    setTimeout(() => {
      progressRoot.render(null);
    }, 200);
  };
}

export function hideProgress() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}`;
document.head.appendChild(styleSheet);
