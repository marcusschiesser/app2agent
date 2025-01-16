"use client";

import { PageHeader } from "@/app/(auth)/components/PageHeader";
import Settings from "@/app/(auth)/admin/settings/Settings";

export default function Page() {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Settings />
      </div>
    </>
  );
}
