import { PageHeader } from "@/app/(auth)/components/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiKeyDisplay } from "./ApiKeyDisplay";
import { getApiKeyAction } from "@/app/(auth)/actions/api-keys";

export default async function Page() {
  const { key } = await getApiKeyAction();

  return (
    <>
      <PageHeader title="Download" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Browser Extension</CardTitle>
            <CardDescription>
              Download and install the browser extension to integrate app2agent
              into your{" "}
              <Link href="/admin/settings" className="underline">
                configured web app
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/extension/extension.zip" className="w-fit">
              <Button>Download Extension</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Installation Instructions</CardTitle>
            <CardDescription>
              Follow these steps to install the browser extension in Chrome:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Extract the downloaded zip archive</li>
              <li>
                Open your Chrome browser, click on the &quot;Window&quot; menu
                and go to the &quot;Extensions&quot; page
              </li>
              <li>
                Ensure that the Developer mode is enabled (toggle in the top
                right corner)
              </li>
              <li>Click &quot;Load unpacked&quot; button in the top left</li>
              <li>Select and upload the extracted folder</li>
              <li>
                After the extension is installed, you will need to enter your
                API key in the extension for authentication.
                <ApiKeyDisplay apiKey={key} />
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              If you need assistance with the extension installation or
              configuration, please don&apos;t hesitate to reach out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Contact{" "}
              <a
                href="https://www.linkedin.com/in/marcusschiesser/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Marcus Schiesser
              </a>{" "}
              for support.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
