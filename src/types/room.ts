/** Chi phí chi tiết (tuỳ chọn trong raw — thiếu thì mockData gán mặc định). */
export type RawRoomCostBreakdown = {
  electricity: string;
  water: string;
  internet: string;
  parking: string;
  other: string;
  depositMonths: number;
};

/** Đánh giá trong file nguồn (không cần id, sẽ gán khi build). */
export type RawRoomReview = {
  author: string;
  rating: number;
  comment: string;
};

/** Dữ liệu phòng trong file nguồn (trước khi bổ sung landlord, review tự sinh, v.v.) */
export type RawRoom = {
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
  /** Nếu không có, mockData gán theo thứ tự phòng mặc định. */
  landlordId?: string;
  costBreakdown?: RawRoomCostBreakdown;
  rentalConditions?: string[];
  /** `undefined` = tự sinh như cũ; `[]` = không có đánh giá. */
  reviews?: RawRoomReview[];
  /** Từ khóa tìm Google Maps (embed + link). Trống thì dùng địa chỉ phòng. */
  mapSearchQuery?: string;
};

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
  /** Dùng cho iframe/link Maps khi khác địa chỉ hiển thị. */
  mapSearchQuery?: string;
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
