import { AuthForm } from "@/components/auth/AuthForm";

export default async function AuthPage(props: {
  searchParams: Promise<{
    signup?: string;
    invite_code?: string;
  }>;
}) {
  const { signup, invite_code } = (await props.searchParams) ?? {};
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <AuthForm enableSignup={signup} inviteCode={invite_code} />
      </div>
    </div>
  );
}
