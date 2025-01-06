"use client";

import { PageHeader } from "@/app/(auth)/components/PageHeader";
import Settings from "@/app/(auth)/admin/settings/Settings";
import { useAuth } from "@/providers/AuthProvider";

export default function Page() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Settings userId={user.id} />
      </div>
    </>
  );
}
