import { useState, useEffect } from "react";
import { fetchUserCredit } from "@/integrations/supabase/api/user";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook to fetch and manage user credit balance
 * @returns An object with creditBalance and functions to reload it
 */
export const useUserCredit = () => {
	const { user } = useAuth();
	const [creditBalance, setCreditBalance] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const loadCreditBalance = async () => {
		if (!user) {
			setCreditBalance(0);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const balance = await fetchUserCredit();
			setCreditBalance(balance);
		} catch (err) {
			console.error("Error fetching credit balance:", err);
			setError(err instanceof Error ? err : new Error(String(err)));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadCreditBalance();
	}, [user]);

	return {
		creditBalance,
		loading,
		error,
		reloadCreditBalance: loadCreditBalance,
		refreshCredit: loadCreditBalance, // Alias for reloadCreditBalance
	};
};
