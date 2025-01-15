import { ChevronLeft, Settings } from "lucide-react";
import { useState } from "react";

interface MenuButtonProps {
  disableSettings?: boolean;
  onSettingsChange: (show: boolean) => void;
}

export function MenuButton({
  disableSettings,
  onSettingsChange,
}: MenuButtonProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    if (!disableSettings) {
      const newValue = !showSettings;
      setShowSettings(newValue);
      onSettingsChange(newValue);
    }
  };

  const handleBackClick = () => {
    setShowSettings(false);
    onSettingsChange(false);
  };

  return (
    <div className="absolute left-0">
      {showSettings ? (
        <button
          onClick={handleBackClick}
          className="rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Back"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      ) : (
        <button
          onClick={handleSettingsClick}
          className={`rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disableSettings ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Settings"
          disabled={disableSettings}
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
