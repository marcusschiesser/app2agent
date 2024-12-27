"use client";

import { authAction } from "@/app/actions";
import { useActionState, useState } from "react";

export function AuthForm() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [state, formAction, isPending] = useActionState(authAction, {});

	if (state.type === "success" && state.message) {
		return (
			<div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
				<div className="flex flex-col gap-8 w-full max-w-xl text-center">
					<div className="text-6xl font-bold text-indigo-600">🎉 Success!</div>
					<div className="text-2xl text-gray-600">{state.message}</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in to your account
				</h2>
			</div>
			<div className="w-full max-w-md mx-auto p-6">
				<form
					className="space-y-4"
					action={(formdata) => {
						formdata.append("type", isSignUp ? "signUp" : "signIn");
						formAction(formdata);
					}}
				>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							name="email"
							type="email"
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							name="password"
							type="password"
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>
					{state.type === "error" && state.message && (
						<div className="text-red-500 text-sm">{state.message}</div>
					)}
					<button
						type="submit"
						disabled={isPending}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
					>
						{isPending ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
					</button>
					<button
						type="button"
						onClick={() => setIsSignUp((prev) => !prev)}
						className="w-full text-sm text-indigo-600 hover:text-indigo-500"
					>
						{isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
					</button>
				</form>
			</div>
		</>
	);
}
