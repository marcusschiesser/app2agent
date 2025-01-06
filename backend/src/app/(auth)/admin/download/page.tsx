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
