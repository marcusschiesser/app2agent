import { useConfig, Mode } from "@/hooks/use-config";

export function Header() {
  const { mode } = useConfig();
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        {mode === Mode.Tutor ? "AI-Tutor" : "IT-Support"}
      </h1>
      <p className="text-sm text-gray-600">by app2agent</p>
    </div>
  );
}
