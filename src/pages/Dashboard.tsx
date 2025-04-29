import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import MachineCard from "@/components/MachineCard";
import { useUserCredit } from "@/hooks/useUserCredit";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Machine = Database["public"]["Tables"]["machines"]["Row"];

const Dashboard = () => {
	const { user } = useAuth();
	const { creditBalance } = useUserCredit();
	const [machines, setMachines] = useState<Machine[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch machines on component mount
	useEffect(() => {
		const fetchMachines = async () => {
			try {
				const { data, error } = await supabase.from("machines").select("*");

				if (error) {
					throw error;
				}

				setMachines(data || []);
			} catch (error) {
				console.error("Error fetching machines:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMachines();
	}, []);

	// Subscribe to machine updates
	useEffect(() => {
		const channel = supabase
			.channel("machines-changes")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "machines",
				},
				(payload) => {
					const updatedMachine = payload.new as Machine;
					setMachines((currentMachines) =>
						currentMachines.map((machine) =>
							machine.id === updatedMachine.id ? updatedMachine : machine
						)
					);
				}
			)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "machines",
				},
				(payload) => {
					const newMachine = payload.new as Machine;
					setMachines((currentMachines) => [...currentMachines, newMachine]);
				}
			)
			.subscribe();

		// Cleanup subscription on unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	// Convert Supabase machine to UI machine format
	const mapToUiMachine = (machine: Machine) => ({
		id: machine.id,
		name: machine.name,
		status: machine.status,
		specs: machine.specs,
		hourlyRate: machine.hourly_rate,
	});

	return (
		<MainLayout>
			<div className="max-w-6xl mx-auto">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-800">
						Welcome, {user?.user_metadata?.display_name || "User"}
					</h1>
					<div className="flex items-center">
						<p className="text-gray-600 mr-4">Select a machine to rent</p>
						<div className="text-sm bg-gray-100 rounded-md px-3 py-1">
							<span className="text-gray-700">Credit Balance:</span>{" "}
							<span className="font-medium text-cafe-blue">
								${creditBalance.toFixed(2)}
							</span>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-8">Loading machines...</div>
				) : machines.length === 0 ? (
					<div className="text-center py-8">
						No machines available at this time.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{machines.map((machine) => (
							<MachineCard
								key={machine.id}
								machine={mapToUiMachine(machine)}
								showRentButton={true}
							/>
						))}
					</div>
				)}
			</div>
		</MainLayout>
	);
};

export default Dashboard;
