import { PageHeader } from "@/app/(auth)/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getApiKeyAction } from "@/app/(auth)/actions/api-keys";
import { OutsystemsIntegrationContent } from "./OutsystemsIntegrationContent";

export const metadata = {
  title: "Outsystems Integration",
};

export default async function OutsystemsIntegrationPage() {
  const { key } = await getApiKeyAction();

  return (
    <>
      <PageHeader title="Outsystems Integration" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Integration Instructions</CardTitle>
            <CardDescription>
              Add the following script to your Outsystems application to
              integrate app2agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OutsystemsIntegrationContent apiKey={key} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
