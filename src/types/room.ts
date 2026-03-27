export interface Room {
  id: string;
  landlordId: string;
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
  nearestSchoolKm: number;
  verification: {
    landlordVerified: boolean;
    postVerified: boolean;
  };
  costBreakdown: {
    electricity: string;
    water: string;
    internet: string;
    parking: string;
    other: string;
    depositMonths: number;
  };
  rentalConditions: string[];
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
  }>;
  roommateMatching: {
    available: boolean;
    preference?: string;
  };
  supportLanguages: string[];
  legalGuidance: string[];
}
