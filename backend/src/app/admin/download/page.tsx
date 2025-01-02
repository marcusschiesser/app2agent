import { PageHeader } from "@/components/PageHeader";
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
              Download and install the app2agent browser extension to add IT
              support to your web app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/extension.zip" className="w-fit">
              <Button>Download Extension</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
