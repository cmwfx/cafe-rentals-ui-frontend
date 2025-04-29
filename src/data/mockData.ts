
// Mock data for the cafe PC rental system

export interface Machine {
  id: string;
  name: string;
  status: 'available' | 'occupied';
  specs: string;
  hourlyRate: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  creditBalance: number;
}

export interface RentalSession {
  id: string;
  machineId: string;
  machineName: string;
  startTime: string;
  endTime: string;
  duration: number; // In minutes
  cost: number;
}

// Mock machines
export const machines: Machine[] = [
  {
    id: '1',
    name: 'Gaming PC 1',
    status: 'available',
    specs: 'RTX 3080, i9-11900K, 32GB RAM',
    hourlyRate: 15,
  },
  {
    id: '2',
    name: 'Gaming PC 2',
    status: 'occupied',
    specs: 'RTX 3070, i7-11700K, 16GB RAM',
    hourlyRate: 12,
  },
  {
    id: '3',
    name: 'Workstation 1',
    status: 'available',
    specs: 'RTX 3060, i5-11600K, 16GB RAM',
    hourlyRate: 10,
  },
  {
    id: '4',
    name: 'Workstation 2',
    status: 'available',
    specs: 'GTX 1660 Super, i5-10400F, 16GB RAM',
    hourlyRate: 8,
  },
  {
    id: '5',
    name: 'Gaming PC 3',
    status: 'occupied',
    specs: 'RTX 3090, i9-12900K, 64GB RAM',
    hourlyRate: 18,
  },
  {
    id: '6',
    name: 'Gaming PC 4',
    status: 'available',
    specs: 'RX 6800 XT, Ryzen 7 5800X, 32GB RAM',
    hourlyRate: 14,
  },
];

// Mock user
export const currentUser: User = {
  id: '1',
  displayName: 'John Doe',
  email: 'john@example.com',
  creditBalance: 50,
};

// Mock rental sessions
export const rentalSessions: RentalSession[] = [
  {
    id: '1',
    machineId: '2',
    machineName: 'Gaming PC 2',
    startTime: '2025-04-25T14:00:00',
    endTime: '2025-04-25T16:00:00',
    duration: 120,
    cost: 24,
  },
  {
    id: '2',
    machineId: '5',
    machineName: 'Gaming PC 3',
    startTime: '2025-04-24T10:00:00',
    endTime: '2025-04-24T11:00:00',
    duration: 60,
    cost: 18,
  },
];

// Mock active session
export const activeSession = {
  machineId: '1',
  machineName: 'Gaming PC 1',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
  duration: 60,
  cost: 15,
  tempPassword: 'CAFE1234',
  timeRemaining: 60 * 60, // in seconds
};

// Hard-coded authentication state
export const isLoggedIn = true;
