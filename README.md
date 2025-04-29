# CafeConnect - PC Rental Management System

CafeConnect is a complete system for internet cafes to manage PC rentals with automatic password generation, machine monitoring, and realtime status updates.

## Features

- User account creation and credit management
- Realtime machine status monitoring
- Automatic password generation for rentals
- Admin dashboard to manage machines and sessions
- Windows agent for automatic machine registration and command execution

## Architecture

The system consists of three main components:

1. **React Frontend**: User and admin interfaces
2. **Supabase Backend**: Database, authentication, and realtime updates
3. **Windows Agent**: Runs on each cafe PC to register with the system and execute commands

## Setting Up the Windows Agent

To set up the Windows agent on cafe PCs:

1. Navigate to the `/agent` directory
2. Copy the `.env.example` file to `.env`
3. Edit the `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SERVICE_ROLE_KEY=your_service_role_key
   ```
4. Install the dependencies:
   ```
   npm install
   ```
5. Install and start the Windows service (requires admin privileges):
   ```
   npm run install-service
   ```

Once installed, the agent will:

1. Register the machine with your Supabase backend
2. Listen for commands from the Supabase realtime API
3. Execute password changes when rentals start
4. Allow locking the workstation remotely

> **Important**: Each PC needs a local Windows user account named `café_user` that customers will use. The agent will change its password when rentals begin.

## Development Setup

To set up the development environment:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Database Migrations

The Supabase database schema is defined in migration files in the `supabase/migrations` directory. Apply them using the Supabase CLI:

```
supabase db push
```

## Production Deployment

For production deployment:

1. Build the React app:
   ```
   npm run build
   ```
2. Deploy the built files to your hosting provider
3. Install the Windows agent on each cafe PC

## License

MIT
