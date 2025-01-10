import { resetPasswordAction } from "@/app/(auth)/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../../../../components/ui/button";
import { cn } from "@/lib/utils";

export default function ResetPassword({
  isSuccess,
  message,
}: {
  isSuccess?: boolean;
  message?: string;
}) {
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60 mb-4">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      {message && (
        <p
          className={cn(
            "text-sm text-foreground/60",
            isSuccess ? "text-green-500" : "text-red-500",
          )}
        >
          {message}
        </p>
      )}
      <Button type="submit" formAction={resetPasswordAction}>
        Reset password
      </Button>
    </form>
  );
}
