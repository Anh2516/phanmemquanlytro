export interface Landlord {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  zalo?: string;
  email: string;
  bio: string;
  experienceYears: number;
  verified: boolean;
  languages: string[];
}
