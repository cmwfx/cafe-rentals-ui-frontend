const { Service } = require("node-windows");
const path = require("path");
require("dotenv").config();

// Validate environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const MACHINE_ID = process.env.MACHINE_ID;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
	console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars");
	console.error("Please create a .env file with these variables");
	process.exit(1);
}

// Create a new service object
const svc = new Service({
	name: "CafeConnect Agent",
	description: "CafeConnect cafe PC rental agent service",
	script: path.join(__dirname, "index.js"),
	env: [
		{
			name: "SUPABASE_URL",
			value: SUPABASE_URL,
		},
		{
			name: "SERVICE_ROLE_KEY",
			value: SERVICE_ROLE_KEY,
		},
	],
});

// If MACHINE_ID is defined, add it to the service environment
if (MACHINE_ID) {
	svc.env.push({
		name: "MACHINE_ID",
		value: MACHINE_ID,
	});
}

// Handle service events
svc.on("install", () => {
	console.log("Service installed successfully");
	svc.start();
});

svc.on("start", () => {
	console.log("Service started successfully");
});

svc.on("error", (error) => {
	console.error("Service error:", error);
});

// Install the service
console.log("Installing CafeConnect Agent service...");
svc.install();
