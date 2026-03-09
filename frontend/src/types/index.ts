export type UserRole = 'admin' | 'barber' | 'client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  loyaltyPoints: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
}

export interface QueueEntry {
  id: string;
  clientName: string;
  serviceName: string;
  barberName: string;
  estimatedWaitTime: number;
  status: 'waiting' | 'in-progress' | 'completed';
  joinedAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
}