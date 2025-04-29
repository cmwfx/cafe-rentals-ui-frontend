import MainLayout from "@/layouts/MainLayout";
import { rentalSessions } from "@/data/mockData";
import Button from "@/components/Button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCredit } from "@/hooks/useUserCredit";
import { useEffect, useState } from "react";
import {
	Transaction,
	getUserTransactions,
} from "@/integrations/supabase/api/transactions";

const Profile = () => {
	const { user } = useAuth();
	const { creditBalance, reloadCreditBalance } = useUserCredit();
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			const txs = await getUserTransactions();
			setTransactions(txs);
		};

		fetchTransactions();
	}, []);

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const calculateDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		if (hours > 0 && remainingMinutes > 0) {
			return `${hours}h ${remainingMinutes}m`;
		} else if (hours > 0) {
			return `${hours}h`;
		} else {
			return `${remainingMinutes}m`;
		}
	};

	const handleAddCredit = () => {
		// This would typically open a payment modal or redirect to a payment page
		alert("Add credit functionality would be implemented here");
		// After adding credit, we would reload the credit balance
		reloadCreditBalance();
	};

	return (
		<MainLayout>
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-md p-8 mb-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-800">
								{user?.user_metadata?.display_name || user?.email}
							</h1>
							<p className="text-gray-600">{user?.email}</p>
						</div>
						<div className="mt-4 md:mt-0">
							<div className="flex items-center space-x-2">
								<span className="text-gray-600">Credit Balance:</span>
								<span className="text-lg font-medium text-cafe-blue">
									${creditBalance.toFixed(2)}
								</span>
								<Button size="sm" onClick={handleAddCredit}>
									Add Credit
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-medium text-gray-800">
							Rental History
						</h2>
					</div>
					<div className="divide-y divide-gray-200">
						{rentalSessions.length > 0 ? (
							rentalSessions.map((session) => (
								<div key={session.id} className="p-6">
									<div className="flex flex-col md:flex-row md:items-center md:justify-between">
										<div>
											<h3 className="text-base font-medium text-gray-800">
												{session.machineName}
											</h3>
											<p className="text-sm text-gray-600">
												{formatDate(session.startTime)}
											</p>
										</div>
										<div className="mt-2 md:mt-0 flex flex-col md:items-end">
											<span className="text-sm font-medium text-gray-800">
												{calculateDuration(session.duration)} - $
												{session.cost.toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="p-6 text-center">
								<p className="text-gray-600">No rental history yet</p>
								<Link
									to="/"
									className="text-cafe-blue hover:text-cafe-blue-dark mt-2 inline-block"
								>
									Browse available PCs
								</Link>
							</div>
						)}
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-medium text-gray-800">
							Transaction History
						</h2>
					</div>
					<div className="divide-y divide-gray-200">
						{transactions.length > 0 ? (
							transactions.map((tx) => (
								<div key={tx.id} className="p-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<div className="bg-gray-100 rounded-full p-2 mr-3">
												{tx.type === "refill" ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-green-500"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
															clipRule="evenodd"
														/>
													</svg>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-blue-500"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
															clipRule="evenodd"
														/>
													</svg>
												)}
											</div>
											<div>
												<h3 className="text-base font-medium text-gray-800 capitalize">
													{tx.type}
												</h3>
												<p className="text-sm text-gray-600">
													{formatDate(tx.ts)}
												</p>
											</div>
										</div>
										<div className="text-right">
											<span
												className={`text-sm font-medium ${
													tx.type === "refill"
														? "text-green-600"
														: "text-blue-600"
												}`}
											>
												{tx.type === "refill" ? "+" : "-"}$
												{tx.amount.toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="p-6 text-center">
								<p className="text-gray-600">No transaction history yet</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Profile;
