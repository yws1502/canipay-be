export enum PaymentStatusEnum {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

export type PaymentStatus = 'available' | 'unavailable' | 'unregistered';

export interface Store {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: string;
  lon: string;
  paymentStatus: PaymentStatus;
  reviewCount: number;
  likeCount: number;
}
