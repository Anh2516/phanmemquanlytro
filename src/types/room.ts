export interface Room {
  id: string;
  title: string;
  district: string;
  address: string;
  price: number;
  area: number;
  floor: number;
  available: boolean;
  images: string[];
  amenities: string[];
  description: string;
  contact: { phone: string; zalo?: string };
}
