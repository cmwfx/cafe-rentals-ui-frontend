import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/Button";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCredit } from "@/hooks/useUserCredit";

type Machine = Database["public"]["Tables"]["machines"]["Row"];

function generateTempPassword() {
	// Generate a random password with 8 characters (letters and numbers)
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let password = "CAFE";
	for (let i = 0; i < 4; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return password;
}

const RentMachine = () => {
	const { machineId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { creditBalance, refreshCredit } = useUserCredit();
	const [isLoading, setIsLoading] = useState(false);
	const [machine, setMachine] = useState<Machine | null>(null);
	const [duration, setDuration] = useState<number>(60); // Default 60 minutes
	const [cost, setCost] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMachine = async () => {
			if (!machineId) {
				navigate("/");
				return;
			}

			try {
				const { data, error } = await supabase
					.from("machines")
					.select("*")
					.eq("id", machineId)
					.single();

				if (error) throw error;

				if (!data) {
					navigate("/");
					return;
				}

				if (data.status !== "available") {
					navigate("/");
					return;
				}

				setMachine(data);
				// Calculate initial cost
				setCost((data.hourly_rate / 60) * duration);
			} catch (error) {
				console.error("Error fetching machine:", error);
				navigate("/");
			}
		};

		fetchMachine();
	}, [machineId, navigate]);

	useEffect(() => {
		if (machine) {
			// Recalculate cost when duration changes
			setCost(parseFloat(((machine.hourly_rate / 60) * duration).toFixed(2)));
		}
	}, [duration, machine]);

	const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setDuration(parseInt(e.target.value));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!machine || !user) return;

		// Check if user has enough credits
		if (creditBalance < cost) {
			setError("You don't have enough credit balance for this rental.");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Generate temporary password
			const tempPassword = generateTempPassword();

			// Start a new session
			const { data: session, error: sessionError } = await supabase
				.from("sessions")
				.insert({
					machine_id: machine.id,
					user_id: user.id,
					duration: duration,
					cost: cost,
					temp_password: tempPassword,
					// Calculate end time based on duration
					end_time: new Date(Date.now() + duration * 60 * 1000).toISOString(),
				})
				.select()
				.single();

			if (sessionError) throw sessionError;

			// Update machine status
			const { error: machineError } = await supabase
				.from("machines")
				.update({
					status: "occupied",
					current_session: session.id,
				})
				.eq("id", machine.id);

			if (machineError) throw machineError;

			// Send command to change password
			const { error: commandError } = await supabase.from("commands").insert({
				machine_id: machine.id,
				action: "changePassword",
				payload: { password: tempPassword },
			});

			if (commandError) throw commandError;

			// Subtract credits
			await supabase.rpc("add_user_credit", {
				user_uuid: user.id,
				add_amount: -cost,
			});

			// Refresh user credit
			await refreshCredit();

			// Navigate to active session page
			navigate(`/session/${session.id}`);
		} catch (error) {
			console.error("Error creating session:", error);
			setError("Failed to start rental session. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (!machine) {
		return (
			<MainLayout>
				<div className="flex justify-center items-center h-64">
					<p className="text-gray-600">Loading...</p>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="max-w-2xl mx-auto">
				<div className="mb-6">
					<Link
						to="/"
						className="text-cafe-blue hover:text-cafe-blue-dark flex items-center"
					>
						<svg
							className="w-4 h-4 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 19l-7-7 7-7"
							></path>
						</svg>
						Back to all PCs
					</Link>
				</div>

				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-medium text-gray-800">Rent PC</h2>
					</div>
					<div className="p-6">
						<div className="mb-6">
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								{machine.name}
							</h3>
							<p className="text-gray-600 mb-2">{machine.specs}</p>
							<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-cafe-available">
								Available
							</div>
						</div>

						{error && (
							<div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="duration"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Rental Duration
								</label>
								<select
									id="duration"
									name="duration"
									value={duration}
									onChange={handleDurationChange}
									className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cafe-blue"
								>
									<option value="30">30 minutes</option>
									<option value="60">1 hour</option>
									<option value="120">2 hours</option>
									<option value="180">3 hours</option>
									<option value="240">4 hours</option>
								</select>
							</div>

							<div className="bg-gray-50 p-4 rounded-md">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-gray-600">Rate per hour:</span>
									<span className="font-medium">
										${machine.hourly_rate.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-gray-600">Duration:</span>
									<span className="font-medium">{duration} minutes</span>
								</div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-gray-600">Your balance:</span>
									<span className="font-medium">
										${creditBalance.toFixed(2)}
									</span>
								</div>
								<hr className="my-2" />
								<div className="flex justify-between items-center">
									<span className="font-medium">Total Cost:</span>
									<span className="text-lg font-bold text-cafe-blue">
										${cost.toFixed(2)}
									</span>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading || creditBalance < cost}
							>
								{isLoading ? "Processing..." : "Confirm Rental"}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default RentMachine;
