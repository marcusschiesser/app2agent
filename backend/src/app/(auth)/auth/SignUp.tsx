"use client";

import { AuthState, signUpAction } from "@/app/(auth)/actions/auth";
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

export function SignUp({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  let initialState: AuthState = {};

  if (typeof window !== "undefined") {
    // Handle hash parameters for error states
    const hash = window.location.hash.substring(1);
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      const error = hashParams.get("error");
      const error_description = hashParams.get("error_description");

      if (error && error_description) {
        initialState = {
          type: "error",
          message: decodeURIComponent(error_description),
        };
      }
    }

    // Handle search parameters for form prefilling
    const searchParams = new URLSearchParams(window.location.search);
    const formData: Record<string, string> = {};

    // List of valid form fields
    const validFields = [
      "email",
      "name",
      "companyName",
      "intendedUsage",
      "linkedInProfile",
    ];

    validFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value) {
        formData[field] = value;
      }
    });

    if (Object.keys(formData).length > 0) {
      initialState = {
        ...initialState,
        formData,
      };
    }
  }

  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  const previousFormData = state.formData as Record<string, string> | undefined;

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
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Join us to transform your enterprise web apps
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.type === "error" && state.message && (
            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}
          <form action={formAction}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    defaultValue={previousFormData?.email || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input name="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    defaultValue={previousFormData?.name || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    name="companyName"
                    type="text"
                    placeholder="Acme Inc"
                    required
                    defaultValue={previousFormData?.companyName || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="intendedUsage">
                    Intended Usage (Optional)
                  </Label>
                  <Input
                    name="intendedUsage"
                    type="text"
                    placeholder="How do you plan to use our product?"
                    defaultValue={previousFormData?.intendedUsage || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linkedInProfile">
                    LinkedIn Profile (Optional)
                  </Label>
                  <Input
                    name="linkedInProfile"
                    type="url"
                    placeholder="https://www.linkedin.com/in/your-profile"
                    defaultValue={previousFormData?.linkedInProfile || ""}
                  />
                </div>

                <Button disabled={isPending}>
                  {isPending && (
                    <div
                      className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                      role="status"
                      aria-label="Loading"
                    />
                  )}
                  Sign up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/auth"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
