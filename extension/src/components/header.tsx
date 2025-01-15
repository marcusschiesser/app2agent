import { ChevronLeft, Settings } from "lucide-react";

interface HeaderProps {
  onSettingsClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  disableSettings?: boolean;
}

export function Header({
  onSettingsClick,
  onBackClick,
  showBackButton,
  disableSettings, // disable settings button if call is active to avoid losing the call when unmounting the component
}: HeaderProps) {
  return (
    <div className="flex items-center mb-6 relative">
      <div className="absolute left-0">
        {showBackButton && onBackClick ? (
          <button
            onClick={onBackClick}
            className="rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Back"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        ) : onSettingsClick ? (
          <button
            onClick={onSettingsClick}
            className={`rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              disableSettings ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Settings"
            disabled={disableSettings}
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        ) : null}
      </div>
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">IT-Support</h1>
        <p className="text-sm text-gray-600">by app2agent</p>
      </div>
    </div>
  );
}
