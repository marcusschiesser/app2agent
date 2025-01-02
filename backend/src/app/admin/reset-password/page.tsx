import ResetPassword from "@/components/ResetPassword";

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{
    success?: string;
    message?: string;
  }>;
}) {
  const { success, message } = (await props.searchParams) ?? {};
  return (
    <div className="container max-w-2xl pl-8">
      <ResetPassword isSuccess={success === "true"} message={message} />
    </div>
  );
}
