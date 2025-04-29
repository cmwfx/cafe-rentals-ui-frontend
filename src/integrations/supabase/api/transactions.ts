import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
	id: string;
	user_id: string;
	amount: number;
	type: string;
	ts: string;
}

/**
 * Fetches the current user's transaction history from the transactions table
 * @returns Array of user transactions or empty array if there's an error
 */
export const getUserTransactions = async (): Promise<Transaction[]> => {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error("Failed to get user:", userError);
		return [];
	}

	const { data, error } = await supabase
		.from("transactions")
		.select("*")
		.eq("user_id", user.id)
		.order("ts", { ascending: false });

	if (error) {
		console.error("Failed to fetch transactions:", error);
		return [];
	}

	return data || [];
};
