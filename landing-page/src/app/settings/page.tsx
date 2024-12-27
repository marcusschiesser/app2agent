import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "../actions";

export default async function DashboardPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/auth");
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="bg-white shadow rounded-lg">
					<div className="px-4 py-5 sm:p-6">
						<h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
						<div className="mt-4">
							<p className="text-gray-600">Welcome, {user.email}</p>
						</div>
						<div className="mt-6">
							<form action={signOutAction}>
								<button
									type="submit"
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Sign Out
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
