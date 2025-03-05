"use client";

import { useState } from "react";
import { ApiKeyDisplay } from "../components/ApiKeyDisplay";
import { OutsystemsCodeSnippet } from "./OutsystemsCodeSnippet";
import { ThemeSelector, type Theme } from "../components/ThemeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OutsystemsIntegrationContent({
  apiKey,
}: {
  apiKey: string | null;
}) {
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [theme, setTheme] = useState<Theme>("support");

  return (
    <div className="space-y-6">
      {/* Script Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>1. Script Configuration</CardTitle>
          <CardDescription>
            Customize the script and manage your API key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSelector theme={theme} onThemeChange={setTheme} />
          <div className="mt-4">
            <OutsystemsCodeSnippet apiKey={currentApiKey} theme={theme} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              API key used by the script:
            </p>
            <ApiKeyDisplay
              apiKey={currentApiKey}
              onApiKeyChange={(newKey) => setCurrentApiKey(newKey)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integration Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle>2. Integration Steps</CardTitle>
          <CardDescription>
            Follow these steps to add app2agent to your OutSystems application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add-script">
            <TabsList className="mb-4">
              <TabsTrigger value="add-script">Step 1: Add Script</TabsTrigger>
              <TabsTrigger value="add-to-layout">
                Step 2: Add to Layouts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add-script" className="space-y-4">
              <div className="text-sm space-y-2">
                <p>
                  <strong>
                    First, create a JavaScript resource in your OutSystems
                    application:
                  </strong>
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    In ODC Studio, go to the <strong>Interface</strong> tab.
                  </li>
                  <li>
                    Right-click on <strong>Scripts</strong> and select{" "}
                    <strong>Create Script</strong>.
                  </li>
                  <li>
                    Name your script (e.g., <code>app2agent</code>).
                  </li>
                  <li>
                    Copy the script above and paste it into the script editor.
                  </li>
                  <li>Save your changes.</li>
                </ol>
              </div>
              <div className="relative aspect-video w-full border rounded-md overflow-hidden mt-4">
                <video
                  className="w-full h-full object-fill"
                  controls
                  autoPlay
                  muted
                  loop
                  src="/platforms/outsystems/add-script.mp4"
                />
              </div>
            </TabsContent>

            <TabsContent value="add-to-layout" className="space-y-4">
              <div className="text-sm space-y-2">
                <p>
                  <strong>
                    Next, add the script to each layout where app2agent should
                    be used:
                  </strong>
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Select the layout you want to add app2agent to.</li>
                  <li>
                    Open <strong>Required Scripts</strong> and select your newly
                    created script.
                  </li>
                  <li>
                    Repeat this for each layout where you want app2agent to be
                    available.
                  </li>
                  <li>Publish your application.</li>
                </ol>
                <p className="mt-2 text-amber-600 dark:text-amber-400">
                  <strong>Important:</strong> You must add the script to{" "}
                  <strong>each layout</strong> where you want app2agent to be
                  available.
                </p>
              </div>
              <div className="relative aspect-video w-full border rounded-md overflow-hidden mt-4">
                <video
                  className="w-full h-full object-fill"
                  controls
                  autoPlay
                  muted
                  loop
                  src="/platforms/outsystems/add-to-layout.mp4"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
