import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { secureFetch } from "@/lib/secure-fetch";

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
      const response = await secureFetch(`/api/validate`, {
        headers: {
          "x-api-key": apiKey,
        },
      });

      const data = await response.json();
      if (data.valid) {
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
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Configure your API key to use the extension
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className={cn(error && "border-red-500")}
              required
            />
            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isValidating || !apiKey}
            className="w-full"
          >
            {isValidating ? "Validating..." : "Save API Key"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
