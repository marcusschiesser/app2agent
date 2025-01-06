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

export default function Page() {
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
            <Link href="/api/admin/download" className="w-fit">
              <Button>Download Extension</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
