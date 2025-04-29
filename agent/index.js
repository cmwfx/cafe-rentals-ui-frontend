const { createClient } = require("@supabase/supabase-js");
const { exec } = require("child_process");
const os = require("os");
require("dotenv").config();

// Environment variables (from .env or set when installing the service)
const PROJECT_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const MACHINE_ID = process.env.MACHINE_ID;

// Validate environment variables
if (!PROJECT_URL || !SERVICE_ROLE_KEY) {
	console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars");
	process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

// Get hostname
const hostname = os.hostname();

// Register machine if needed, or get machine ID
async function registerMachine() {
	if (MACHINE_ID) {
		console.log(`Using existing machine ID: ${MACHINE_ID}`);
		return MACHINE_ID;
	}

	console.log(`Registering machine with hostname: ${hostname}`);

	// Check if machine exists
	const { data: existingMachine, error: checkError } = await supabase
		.from("machines")
		.select("id")
		.eq("hostname", hostname)
		.maybeSingle();

	if (checkError) {
		console.error("Error checking machine:", checkError);
		process.exit(1);
	}

	if (existingMachine) {
		console.log(`Machine already registered with ID: ${existingMachine.id}`);
		return existingMachine.id;
	}

	// Create new machine
	const machineSpecs = await getSystemSpecs();

	const { data: newMachine, error: insertError } = await supabase
		.from("machines")
		.insert({
			hostname: hostname,
			name: `PC-${hostname.substring(0, 5)}`,
			specs: machineSpecs,
			hourly_rate: 12, // Default hourly rate, can be adjusted by admin
			status: "available",
		})
		.select()
		.single();

	if (insertError) {
		console.error("Error registering machine:", insertError);
		process.exit(1);
	}

	console.log(`Machine registered with ID: ${newMachine.id}`);
	return newMachine.id;
}

// Get system specifications
async function getSystemSpecs() {
	try {
		const cpuInfo = os.cpus()[0].model;
		const totalRam = Math.round(os.totalmem() / (1024 * 1024 * 1024)); // Convert to GB

		// Get GPU info using PowerShell (Windows)
		const gpuInfo = await runCommand(
			'powershell "Get-WmiObject Win32_VideoController | Select-Object Name | Format-List"'
		);
		const gpuName =
			gpuInfo
				.split("\r\n")
				.find((line) => line.includes("Name"))
				?.replace("Name :", "")
				?.trim() || "Unknown GPU";

		return `${gpuName}, ${cpuInfo}, ${totalRam}GB RAM`;
	} catch (error) {
		console.error("Error getting system specs:", error);
		return "Specs unavailable";
	}
}

// Helper to exec OS commands
function runCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(stderr || error.message);
			} else {
				resolve(stdout);
			}
		});
	});
}

// Poll for commands and execute them
async function pollCommands(machineId) {
	console.log(`Starting command polling for machine ${machineId}`);

	// Function to check for and process new commands
	async function checkForCommands() {
		try {
			console.log(`Checking for new commands for machine ${machineId}...`);

			// Query for undispatched commands for this machine
			const { data: commands, error } = await supabase
				.from("commands")
				.select("*")
				.eq("machine_id", machineId)
				.eq("dispatched", false);

			if (error) {
				throw error;
			}

			if (commands && commands.length > 0) {
				console.log(`Found ${commands.length} new command(s)`);

				// Process each command
				for (const cmd of commands) {
					console.log(`Processing command: ${cmd.id}, action: ${cmd.action}`);

					try {
						if (cmd.action === "changePassword") {
							// Extract password from payload
							const password = cmd.payload?.password;
							if (!password) {
								throw new Error("No password provided in payload");
							}

							// Change the password for cafe_user account
							console.log(`Changing password for cafe_user to: ${password}`);
							await runCommand(`net user cafe_user ${password}`);
							console.log("Password changed successfully");
						} else if (cmd.action === "lockWorkstation") {
							// Lock the workstation
							console.log("Locking workstation");
							await runCommand(`rundll32.exe user32.dll,LockWorkStation`);
							console.log("Workstation locked successfully");
						} else {
							console.warn(`Unknown command action: ${cmd.action}`);
						}

						// Mark command as dispatched
						const { error: updateError } = await supabase
							.from("commands")
							.update({ dispatched: true })
							.eq("id", cmd.id);

						if (updateError) {
							throw updateError;
						}

						console.log(`Command ${cmd.id} marked as dispatched`);
					} catch (cmdError) {
						console.error(`Error executing command ${cmd.id}:`, cmdError);
					}
				}
			} else {
				console.log("No new commands found");
			}
		} catch (error) {
			console.error("Error polling commands:", error);
		}
	}

	// Initial check
	await checkForCommands();

	// Set up polling interval (5 seconds)
	const POLLING_INTERVAL = 5000; // 5 seconds

	console.log(
		`Command polling set to every ${POLLING_INTERVAL / 1000} seconds`
	);
	return setInterval(checkForCommands, POLLING_INTERVAL);
}

// Main function
async function main() {
	try {
		// Register machine or get existing machine ID
		const machineId = await registerMachine();

		// Start polling for commands
		await pollCommands(machineId);

		console.log("CafeConnect agent is running with polling...");
	} catch (error) {
		console.error("Agent startup error:", error);
		process.exit(1);
	}
}

// Start the agent
main();
