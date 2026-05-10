export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  origin: string;
  destinationId: string;
  destinationName: string;
  departureDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'model';
  content: string;
  createdAt: any; // Firestore Timestamp or ISO string
}

export interface ExtractionResult {
  destination?: string;
  service?: string;
  priceEst?: number;
  origin?: string;
  departureDate?: string;
}
