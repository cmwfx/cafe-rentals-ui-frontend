import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { sendLockWorkstationCommand } from "@/integrations/supabase/api";

type Machine = Database["public"]["Tables"]["machines"]["Row"];
type Session = Database["public"]["Tables"]["sessions"]["Row"] & {
	machines: Machine;
};

const AdminDashboard = () => {
	const [machines, setMachines] = useState<Machine[]>([]);
	const [activeSessions, setActiveSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Fetch machines and active sessions on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch machines
				const { data: machinesData, error: machinesError } = await supabase
					.from("machines")
					.select("*");

				if (machinesError) throw machinesError;

				setMachines(machinesData || []);

				// Fetch active sessions with machine data
				const { data: sessionsData, error: sessionsError } = await supabase
					.from("sessions")
					.select(
						`
            *,
            machines:machine_id(*)
          `
					)
					.is("end_time", null);

				if (sessionsError) throw sessionsError;

				setActiveSessions(sessionsData || []);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("Failed to load data. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Subscribe to realtime updates
	useEffect(() => {
		const machinesChannel = supabase
			.channel("admin-machines-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "machines",
				},
				(payload) => {
					if (payload.eventType === "UPDATE") {
						const updatedMachine = payload.new as Machine;
						setMachines((currentMachines) =>
							currentMachines.map((machine) =>
								machine.id === updatedMachine.id ? updatedMachine : machine
							)
						);
					} else if (payload.eventType === "INSERT") {
						const newMachine = payload.new as Machine;
						setMachines((currentMachines) => [...currentMachines, newMachine]);
					} else if (payload.eventType === "DELETE") {
						const deletedMachine = payload.old as Machine;
						setMachines((currentMachines) =>
							currentMachines.filter(
								(machine) => machine.id !== deletedMachine.id
							)
						);
					}
				}
			)
			.subscribe();

		const sessionsChannel = supabase
			.channel("admin-sessions-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "sessions",
				},
				async (payload) => {
					// Refresh active sessions on any session change
					const { data } = await supabase
						.from("sessions")
						.select(
							`
              *,
              machines:machine_id(*)
            `
						)
						.is("end_time", null);

					setActiveSessions(data || []);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(machinesChannel);
			supabase.removeChannel(sessionsChannel);
		};
	}, []);

	// Lock a workstation
	const handleLockWorkstation = async (machineId: string) => {
		setError(null);
		setSuccess(null);

		try {
			await sendLockWorkstationCommand(machineId);
			setSuccess("Lock command sent successfully.");

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (error) {
			console.error("Error locking workstation:", error);
			setError("Failed to send lock command.");
		}
	};

	// End a session
	const handleEndSession = async (sessionId: string, machineId: string) => {
		setError(null);
		setSuccess(null);

		try {
			// Update session
			const { error: sessionError } = await supabase
				.from("sessions")
				.update({ end_time: new Date().toISOString() })
				.eq("id", sessionId);

			if (sessionError) throw sessionError;

			// Update machine
			const { error: machineError } = await supabase
				.from("machines")
				.update({
					status: "available",
					current_session: null,
				})
				.eq("id", machineId);

			if (machineError) throw machineError;

			setSuccess("Session ended successfully.");

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (error) {
			console.error("Error ending session:", error);
			setError("Failed to end session.");
		}
	};

	if (loading) {
		return (
			<MainLayout>
				<div className="flex justify-center items-center h-64">
					<p className="text-gray-600">Loading admin dashboard...</p>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="max-w-6xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Admin Dashboard
				</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
						{error}
					</div>
				)}

				{success && (
					<div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded">
						{success}
					</div>
				)}

				<div className="mb-8">
					<h2 className="text-xl font-bold text-gray-800 mb-4">
						Active Sessions
					</h2>
					{activeSessions.length === 0 ? (
						<p className="text-gray-600">No active sessions.</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
								<thead className="bg-gray-50">
									<tr>
										<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Machine
										</th>
										<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Start Time
										</th>
										<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Duration
										</th>
										<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Cost
										</th>
										<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Password
										</th>
										<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{activeSessions.map((session) => (
										<tr key={session.id}>
											<td className="py-3 px-4 text-sm text-gray-800">
												{session.machines?.name || "Unknown"}
											</td>
											<td className="py-3 px-4 text-sm text-gray-600">
												{new Date(session.start_time).toLocaleString()}
											</td>
											<td className="py-3 px-4 text-sm text-gray-600">
												{session.duration} minutes
											</td>
											<td className="py-3 px-4 text-sm text-gray-600">
												${session.cost?.toFixed(2)}
											</td>
											<td className="py-3 px-4 text-sm font-mono bg-gray-50">
												{session.temp_password}
											</td>
											<td className="py-3 px-4 text-sm">
												<div className="flex space-x-2">
													<button
														className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
														onClick={() =>
															handleLockWorkstation(session.machine_id)
														}
													>
														Lock
													</button>
													<button
														className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
														onClick={() =>
															handleEndSession(session.id, session.machine_id)
														}
													>
														End
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				<div>
					<h2 className="text-xl font-bold text-gray-800 mb-4">All Machines</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{machines.map((machine) => (
							<div
								key={machine.id}
								className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
							>
								<div className="flex justify-between items-start mb-2">
									<h3 className="font-semibold text-gray-800">
										{machine.name}
									</h3>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											machine.status === "available"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{machine.status}
									</span>
								</div>
								<p className="text-sm text-gray-600 mb-3">{machine.specs}</p>
								<p className="text-sm text-gray-600 mb-3">
									<span className="font-medium">Rate:</span> $
									{machine.hourly_rate}/hour
								</p>
								<p className="text-sm text-gray-600 mb-3">
									<span className="font-medium">Hostname:</span>{" "}
									{machine.hostname}
								</p>
								{machine.status === "occupied" && (
									<button
										className="w-full mt-2 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
										onClick={() => handleLockWorkstation(machine.id)}
									>
										Lock Workstation
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default AdminDashboard;
