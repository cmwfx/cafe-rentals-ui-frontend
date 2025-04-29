# CafeConnect Windows Agent

This is the Windows agent component for the CafeConnect cafe PC rental system. It runs as a Windows service that:

1. Registers the machine with the Supabase backend
2. Polls for commands (password changes, locking workstation)
3. Updates machine status

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Windows operating system
- Administrator access (required to install as a service)
- Supabase service role key

### Installation Steps

1. Copy the `.env.example` file to `.env` and fill in the required values:

   ```
   cp .env.example .env
   ```

2. Edit the `.env` file with your Supabase credentials:

   - `SUPABASE_URL`: Your Supabase project URL
   - `SERVICE_ROLE_KEY`: Your Supabase service role key (not the anon key)

3. Install dependencies:

   ```
   npm install
   ```

4. Install and start the Windows service (requires admin privileges):
   ```
   npm run install-service
   ```

### Running Without Installing as a Service

During development or testing, you can run the agent directly:

```
npm start
```

## How It Works

1. On first run, the agent registers the machine in the Supabase `machines` table

   - It detects system specs automatically (CPU, RAM, GPU)
   - Default hourly rate is set to $12 (can be modified in the admin panel)

2. It polls the Supabase database every 5 seconds for new commands

   - Looks for commands where `machine_id` matches this machine's ID and `dispatched = false`
   - When a rental starts, it receives a password change command
   - It can receive lock workstation commands
   - After executing a command, it marks it as `dispatched = true`

3. It handles network interruptions gracefully by continuing to poll

## Troubleshooting

- Check Windows Event Viewer for service errors
- Look for log files in the `daemon` subfolder created by node-windows
- Verify your Supabase service role key has write access to the tables
