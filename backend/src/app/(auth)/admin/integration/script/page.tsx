import { PageHeader } from "@/app/(auth)/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getApiKeyAction } from "@/app/(auth)/actions/api-keys";
import { IntegrationContent } from "./IntegrationContent";

export default async function Page() {
  const { key } = await getApiKeyAction();

  return (
    <>
      <PageHeader title="Website Integration" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Integration Instructions</CardTitle>
            <CardDescription>
              Add the following script to the head section of your website to
              integrate app2agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IntegrationContent apiKey={key} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Installation Steps</CardTitle>
            <CardDescription>
              Follow these steps to integrate app2agent into your website:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Copy the script snippet above</li>
              <li>
                Add it to the <code>&lt;head&gt;</code> section of your
                website&apos;s HTML
              </li>
              <li>
                The script will automatically initialize app2agent with your API
                key
              </li>
              <li>
                Test the integration by visiting your website - you should see
                the app2agent interface
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              If you need assistance with the integration or have any questions,
              please don&apos;t hesitate to reach out.
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
