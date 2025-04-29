import { supabase } from "./client";

/**
 * Sends a command to change the password on a machine
 * @param machineId The ID of the machine
 * @param password The new password to set
 */
export async function sendChangePasswordCommand(
	machineId: string,
	password: string
) {
	const { data, error } = await supabase.from("commands").insert({
		machine_id: machineId,
		action: "changePassword",
		payload: { password },
	});

	if (error) {
		throw error;
	}

	return data;
}

/**
 * Sends a command to lock a machine's workstation
 * @param machineId The ID of the machine
 */
export async function sendLockWorkstationCommand(machineId: string) {
	const { data, error } = await supabase.from("commands").insert({
		machine_id: machineId,
		action: "lockWorkstation",
	});

	if (error) {
		throw error;
	}

	return data;
}

/**
 * Ends a rental session and marks the machine as available
 * @param sessionId The ID of the session to end
 */
export async function endRentalSession(sessionId: string) {
	// First, get the session to find the machine
	const { data: session, error: sessionError } = await supabase
		.from("sessions")
		.select("machine_id")
		.eq("id", sessionId)
		.single();

	if (sessionError) {
		throw sessionError;
	}

	// Update the session end time
	const { error: updateSessionError } = await supabase
		.from("sessions")
		.update({
			end_time: new Date().toISOString(),
		})
		.eq("id", sessionId);

	if (updateSessionError) {
		throw updateSessionError;
	}

	// Update the machine status
	const { error: updateMachineError } = await supabase
		.from("machines")
		.update({
			status: "available",
			current_session: null,
		})
		.eq("id", session.machine_id);

	if (updateMachineError) {
		throw updateMachineError;
	}

	return true;
}

/**
 * Gets all machines
 */
export async function getAllMachines() {
	const { data, error } = await supabase.from("machines").select("*");

	if (error) {
		throw error;
	}

	return data;
}

/**
 * Gets a machine by ID
 * @param machineId The ID of the machine to get
 */
export async function getMachineById(machineId: string) {
	const { data, error } = await supabase
		.from("machines")
		.select("*")
		.eq("id", machineId)
		.single();

	if (error) {
		throw error;
	}

	return data;
}

/**
 * Gets all active sessions
 */
export async function getActiveSessions() {
	const { data, error } = await supabase
		.from("sessions")
		.select(
			`
      *,
      machines:machine_id(*)
    `
		)
		.is("end_time", null);

	if (error) {
		throw error;
	}

	return data;
}
