import { supabase } from "@/integrations/supabase/client";

// Define interface for user with profile data
export interface UserWithProfile {
	id: string;
	email: string;
	display_name: string | null;
	credit_balance: number;
}

/**
 * Helper function to check if the current user is an admin
 * This should match the RLS policy in Supabase
 */
export const checkIsAdmin = async (): Promise<boolean> => {
	try {
		const { data, error } = await supabase.rpc("is_admin");

		if (error) {
			console.error("Error checking admin status:", error);
			return false;
		}

		return data?.[0]?.is_admin || false;
	} catch (err) {
		console.error("Error checking admin status:", err);
		return false;
	}
};

/**
 * Fetches all users with their profiles for admin dashboard
 * This uses a secure Supabase Edge Function to get user data
 */
export const fetchUsersWithProfiles = async (): Promise<UserWithProfile[]> => {
	try {
		// Call the Edge Function using the supabase client's functions.invoke method
		const { data, error } = await supabase.functions.invoke(
			"list_users_with_profiles"
		);

		if (error) {
			console.error("Error fetching users with profiles:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("Error fetching users with profiles:", error);
		throw error;
	}
};
