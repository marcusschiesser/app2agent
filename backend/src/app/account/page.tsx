"use client";

import { signOutAction } from "@/app/actions/auth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";

export default function Page() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Account" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Welcome, {user.email}</p>
            <div className="mt-6">
              <form action={signOutAction}>
                <Button type="submit" variant="default">
                  Sign Out
                </Button>
              </form>
            </div>
            {/* TODO: We can add more sections here. Eg: Billing, Upgrade to Pro, etc. */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
