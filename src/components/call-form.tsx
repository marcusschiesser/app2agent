interface CallFormProps {
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
  volume: number;
}

export function CallForm({ isEnabled, onToggle, volume }: CallFormProps) {
  const volumeSize = Math.max(8, Math.min(volume * 400, 24));

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">IT-Support</h1>
        <p className="text-sm text-gray-600">by app2agent</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center relative">
          {isEnabled && (
            <>
              <div
                className="absolute inset-0 rounded-full transition-all duration-200"
                style={{
                  boxShadow: `0 0 0 ${volumeSize}px rgba(239, 68, 68, 0.15)`,
                  animation: "pulse 2s infinite",
                }}
              />
              <div
                className="absolute inset-0 rounded-full transition-all duration-200"
                style={{
                  boxShadow: `0 0 0 ${volumeSize * 0.6}px rgba(239, 68, 68, 0.3)`,
                }}
              />
            </>
          )}
          {!isEnabled ? (
            <button
              onClick={() => onToggle(true)}
              className="relative z-10 flex items-center justify-center w-full h-full bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => onToggle(false)}
              className="relative z-10 flex items-center justify-center w-full h-full bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {isEnabled ? "End Call" : "Start Call"}
        </span>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
