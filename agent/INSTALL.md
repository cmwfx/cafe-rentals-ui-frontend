# CafeConnect Windows Agent Installation Guide

This guide will walk you through installing the CafeConnect Windows agent on your cafe PCs. The agent allows your computers to appear in the CafeConnect dashboard and receive commands.

## Prerequisites

Before you begin, you need:

1. Windows 10 or 11 PC
2. Administrator access to the PC
3. Node.js 16+ installed (download from [nodejs.org](https://nodejs.org/))
4. A local Windows user account named `cafe_user` for customers to use
5. Supabase service role key (get this from your admin)

## Step 1: Create a cafe_user Account

First, ensure you have a standard Windows user account for customers:

1. Open Command Prompt as administrator
2. Run: `net user cafe_user /add`
3. Set an initial password: `net user cafe_user YourInitialPassword`
4. Make the account a standard user (not administrator)

## Step 2: Download and Extract the Agent

1. Download the agent files from your admin or the project repository
2. Extract the files to a secure location like `C:\CafeConnect`

## Step 3: Configure the Agent

1. Navigate to the agent directory
2. Copy the `.env.example` file to create a new file named `.env`:
   ```
   copy .env.example .env
   ```
3. Open the `.env` file in a text editor
4. Fill in your Supabase URL and service role key (get these from your admin):
   ```
   SUPABASE_URL=https://xlcjopawbjhnlgxvixsl.supabase.co
   SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 4: Install Dependencies

1. Open Command Prompt as administrator
2. Navigate to the agent directory: `cd C:\CafeConnect`
3. Install the required Node.js packages:
   ```
   npm install
   ```

## Step 5: Install as a Windows Service

1. While still in the agent directory, run:
   ```
   npm run install-service
   ```
2. This will install the agent as a Windows service that automatically starts with Windows
3. You should see "Service installed successfully" and "Service started successfully" messages

## Step 6: Verify Installation

1. Check the service is running:

   - Open Services (services.msc)
   - Look for "CafeConnect Agent" in the list
   - Status should be "Running"

2. Log into the CafeConnect admin dashboard
   - Your PC should appear in the "All Machines" list within 1-2 minutes
   - Initial status will be "available"

## Troubleshooting

If the agent doesn't register with the server:

1. Check the Windows Event Viewer for errors
2. Look in the `daemon` folder created in the agent directory for log files
3. Verify your Supabase URL and service key are correct
4. Make sure your firewall allows outbound connections

## Security Considerations

- Store the agent in a directory that standard users cannot access
- The service role key has powerful permissions - keep it secure
- Only install on machines that are physically secured

## How It Works

The agent polls the Supabase database every 5 seconds to check for new commands. When a command is found, it executes the required action (changing password or locking workstation) and then marks the command as dispatched in the database.

## Next Steps

Once installed successfully:

1. Test a rental from the dashboard
2. The agent will automatically change the cafe_user password
3. Customers can then log in with the generated password

## Support

If you encounter issues, please contact your system administrator or refer to the full documentation.
