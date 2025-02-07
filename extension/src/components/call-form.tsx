import { Call, CallOff } from "./icons/call";
import { useConfig, Mode } from "../hooks/use-config";
import { Hand } from "./icons/hand";

interface CallFormProps {
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
  inVolume: number;
  outVolume: number;
}

export function CallForm({
  isEnabled,
  onToggle,
  inVolume,
  outVolume,
}: CallFormProps) {
  const { mode } = useConfig();
  const volumeSize = Math.max(
    8,
    Math.min((inVolume > outVolume ? inVolume : outVolume) * 400, 24),
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center relative">
        {isEnabled && (
          <>
            <div
              className="absolute inset-0 rounded-full transition-all duration-200 animate-pulse-slow"
              style={{
                boxShadow: `0 0 0 ${volumeSize}px rgba(239, 68, 68, 0.15)`,
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
            className={`relative z-10 flex items-center justify-center w-full h-full rounded-full transition-all duration-200 transform
              ${
                mode === Mode.Tutor
                  ? "text-gray-600 hover:text-gray-800 hover:scale-125 hover:animate-wave"
                  : "bg-green-500 hover:bg-green-600 text-white hover:scale-105"
              } 
              disabled:bg-slate-500 disabled:hover:bg-slate-500`}
          >
            {mode === Mode.Tutor ? <Hand /> : <Call />}
          </button>
        ) : (
          <button
            onClick={() => onToggle(false)}
            className="relative z-10 flex items-center justify-center w-full h-full bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 transform hover:scale-105 disabled:bg-slate-500 disabled:hover:bg-slate-500"
          >
            <CallOff />
          </button>
        )}
      </div>
      <span className="text-sm text-gray-500">
        {isEnabled
          ? mode === Mode.Tutor
            ? "Stop"
            : "End Call"
          : mode === Mode.Tutor
            ? "Ask Question"
            : "Start Call"}
      </span>
    </div>
  );
}
