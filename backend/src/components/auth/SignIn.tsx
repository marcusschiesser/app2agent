"use client";

import { AuthState, authAction } from "@/app/actions/auth";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignIn({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  let initialState: AuthState = {};

  if (typeof window !== "undefined") {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const error = params.get("error");
      const error_description = params.get("error_description");

      if (error && error_description) {
        initialState = {
          type: "error",
          message: decodeURIComponent(error_description),
        };
      }
    }
  }

  const [state, formAction, isPending] = useActionState(
    authAction,
    initialState,
  );

  if (state.type === "success" && state.message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-xl justify-center gap-2 p-4">
        <div className="flex flex-col gap-8 w-full text-center">
          <div className="text-5xl font-bold text-indigo-600">🎉 Success!</div>
          <div className="text-xl text-gray-600">{state.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to app2agent</CardDescription>
        </CardHeader>
        <CardContent>
          {state.type === "error" && state.message && (
            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}
          <form
            action={(formdata) => {
              formdata.append("type", "signIn");
              formAction(formdata);
            }}
          >
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input name="password" type="password" required />
                </div>
                <Button disabled={isPending}>
                  {isPending && (
                    <div
                      className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                      role="status"
                      aria-label="Loading"
                    />
                  )}
                  Sign in
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth?signup=true"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
