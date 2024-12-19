import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import ReactMarkdown from "react-markdown";

// Create a container for the modal
const modalContainer = document.createElement("div");
modalContainer.id = "form2content-modal";
modalContainer.className =
  "form2content-styles fixed top-4 right-4 z-[2147483647] pointer-events-auto inline-block";
document.body.appendChild(modalContainer);

// Create a root for React rendering
export const modalRoot = ReactDOM.createRoot(modalContainer);

// Modal component
export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      )}
      {children}
    </div>
  );
}

// Function to show confirmation or message dialog
export function showDialog(
  message: string,
  type: "confirm" | "message" = "confirm",
): Promise<boolean> {
  return new Promise((resolve) => {
    modalRoot.render(
      <React.StrictMode>
        <Modal
          onClose={() => {
            modalRoot.render(null);
            resolve(false);
          }}
        >
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
            <div className="flex justify-end space-x-2">
              {type === "confirm" ? (
                <>
                  <button
                    onClick={() => {
                      modalRoot.render(null);
                      resolve(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      modalRoot.render(null);
                      resolve(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    modalRoot.render(null);
                    resolve(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </Modal>
      </React.StrictMode>,
    );
  });
}
