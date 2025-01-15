import { useState } from "react";
import { getConfig } from "@/hooks/use-config";

interface SettingsProps {
  onSaved: () => void;
}

export function Settings({ onSaved }: SettingsProps) {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("apiKey") || "",
  );
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleValidation = async () => {
    setError("");
    setIsValidating(true);
    const oldApiKey = localStorage.getItem("apiKey");

    try {
      const response = await getConfig(apiKey);

      if (response.ok) {
        localStorage.setItem("apiKey", apiKey);
        onSaved();
      } else {
        setError("Invalid API key. Please try again.");
        if (oldApiKey) {
          localStorage.setItem("apiKey", oldApiKey);
        }
      }
    } catch {
      setError("Failed to validate API key. Please try again.");
      if (oldApiKey) {
        localStorage.setItem("apiKey", oldApiKey);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleValidation();
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your API key"
            required
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isValidating || !apiKey}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? "Validating..." : "Save API Key"}
        </button>
      </form>
    </div>
  );
}
