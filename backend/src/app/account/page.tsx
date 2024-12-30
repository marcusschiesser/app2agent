import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "../actions/auth";
import Settings from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <p className="text-gray-600">Welcome, {user.email}</p>
            </div>
            <div className="mt-6">
              <form action={signOutAction}>
                <Button type="submit" variant="default">
                  Sign Out
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        <Settings userId={user.id} />
      </div>
    </div>
  );
}
