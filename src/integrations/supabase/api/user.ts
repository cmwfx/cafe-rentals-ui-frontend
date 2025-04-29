import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the current user's credit balance from the profiles table
 * @returns The user's credit balance or 0 if there's an error
 */
export const fetchUserCredit = async (): Promise<number> => {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error("Failed to get user:", userError);
		return 0;
	}

	const { data, error } = await supabase
		.from("profiles")
		.select("credit_balance")
		.eq("id", user.id)
		.single();

	if (error) {
		console.error("Failed to fetch credit balance:", error);
		return 0;
	}

	return data.credit_balance || 0;
};
