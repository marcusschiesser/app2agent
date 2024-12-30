"use client";

import { AuthState, authAction } from "@/app/actions/auth";
import { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [isSignUp, setIsSignUp] = useState(false);
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

	const [state, formAction, isPending] = useActionState(authAction, initialState);

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
					<CardTitle className="text-xl">
						{isSignUp ? "Create your account" : "Welcome back"}
					</CardTitle>
					<CardDescription>
						{isSignUp ? "Join us to transform your enterprise web apps" : "Sign in to app2agent"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{state.type === "error" && state.message && (
						<div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
							<p className="text-sm text-red-600">{state.message}</p>
						</div>
					)}
					<form
						action={(formdata) => {
							formdata.append("type", isSignUp ? "signUp" : "signIn");
							formAction(formdata);
						}}
					>
						<div className="grid gap-6">
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input name="email" type="email" placeholder="m@example.com" required />
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
									</div>
									<Input name="password" type="password" required />
								</div>
								<Button
									type="submit"
									className={cn("w-full", {
										"bg-green-600 hover:bg-green-700 focus:ring-green-500": isSignUp,
									})}
									disabled={isPending}
								>
									{isPending ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
								</Button>
							</div>
							<div className="text-center text-sm">
								{isSignUp ? "Already have an account?" : "Need an account?"}
								<button
									type="button"
									onClick={() => setIsSignUp((prev) => !prev)}
									className="underline underline-offset-4 ml-1"
								>
									{isSignUp ? "Sign in" : "Sign up"}
								</button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
