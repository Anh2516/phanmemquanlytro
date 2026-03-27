import type { Room } from "../types/room";
import type { Landlord } from "../types/landlord";

const rawRooms = [
  {
    id: "pt-001",
    title: "Phòng studio ban công — gần ĐH Bách Khoa",
    district: "Quận 10",
    address: "Đường Tô Hiến Thành, P.15, Q.10, TP.HCM",
    price: 4500000,
    area: 28,
    floor: 4,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    amenities: ["Điều hòa", "Nóng lạnh", "Wifi", "Ban công", "Tủ lạnh mini"],
    description:
      "Phòng mới sơn, cửa sổ thoáng, khu an ninh có camera. Cách trường ĐH Bách Khoa 5 phút đi xe máy.",
    contact: { phone: "0903 111 222", zalo: "0903111222" },
  },
  {
    id: "pt-002",
    title: "Phòng đôi có gác — Thảo Điền",
    district: "Quận 2",
    address: "Đường Nguyễn Văn Hưởng, P.Thảo Điền, TP.Thủ Đức",
    price: 7200000,
    area: 35,
    floor: 2,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    ],
    amenities: ["Gác lửng", "Máy giặt riêng", "Bếp", "Điều hòa", "Thang máy"],
    description:
      "Khu dân cư yên tĩnh, gần metro và trung tâm Thảo Điền. Phù hợp cặp đôi hoặc người làm việc tại khu vực.",
    contact: { phone: "0905 444 888", zalo: "0905444888" },
  },
  {
    id: "pt-003",
    title: "Phòng đơn full nội thất — Phú Nhuận",
    district: "Phú Nhuận",
    address: "Đường Phan Đình Phùng, P.1, Phú Nhuận",
    price: 3800000,
    area: 22,
    floor: 3,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    ],
    amenities: ["Giường + nệm", "Tủ quần áo", "Bàn làm việc", "Wifi", "Điều hòa"],
    description:
      "Nhà chủ ở dưới, ra vào bằng khóa vân tay. Gần chợ Phú Nhuận và nhiều quán ăn.",
    contact: { phone: "0938 000 321", zalo: "0938000321" },
  },
  {
    id: "pt-004",
    title: "Căn hộ mini 1PN — view Landmark",
    district: "Bình Thạnh",
    address: "Đường Ung Văn Khiêm, P.25, Bình Thạnh",
    price: 8900000,
    area: 42,
    floor: 12,
    available: false,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    amenities: ["Hồ bơi chung", "Gym", "Bảo vệ 24/7", "Full nội thất", "Bếp từ"],
    description:
      "Chung cư cao cấp, view sông và Landmark. Hiện đang cho thuê lại từ tháng sau.",
    contact: { phone: "0912 777 999", zalo: "0912777999" },
  },
  {
    id: "pt-005",
    title: "Phòng trọ sinh viên — Tân Bình",
    district: "Tân Bình",
    address: "Đường Hoàng Văn Thụ, P.4, Tân Bình",
    price: 2800000,
    area: 18,
    floor: 2,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80",
    ],
    amenities: ["Quạt trần", "Wifi", "WC chung sạch", "Giờ giấc tự do"],
    description:
      "Giá mềm cho sinh viên, gần sân bay và nhiều tuyến bus. Chủ nhà thân thiện.",
    contact: { phone: "0987 654 321", zalo: "0987654321" },
  },
  {
    id: "pt-006",
    title: "Phòng master trong nhà nguyên căn — Gò Vấp",
    district: "Gò Vấp",
    address: "Đường Quang Trung, P.10, Gò Vấp",
    price: 5200000,
    area: 32,
    floor: 1,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80",
    ],
    amenities: ["WC riêng trong phòng", "Cửa sổ lớn", "Điều hòa", "Tủ âm tường"],
    description: "Ở chung nhà nguyên căn nhưng phòng tách biệt, có sân để xe rộng.",
    contact: { phone: "0901 222 333", zalo: "0901222333" },
  },
  {
    id: "pt-007",
    title: "Phòng duplex sân thượng — gần ĐH Kinh tế",
    district: "Quận 1",
    address: "Đường Nguyễn Thị Minh Khai, P.Đa Kao, Q.1",
    price: 9500000,
    area: 38,
    floor: 5,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80",
    ],
    amenities: [
      "Sân thượng riêng",
      "Điều hòa",
      "Thang máy",
      "Wifi",
      "Khóa cửa thông minh",
    ],
    description:
      "Gần trung tâm và các tuyến metro, đi bộ ra phố đi bộ Nguyễn Huệ. Khu yên tĩnh cuối hẻm.",
    contact: { phone: "0909 100 100", zalo: "0909100100" },
  },
  {
    id: "pt-008",
    title: "Phòng trọ nữ — có bảo vệ khu",
    district: "Quận 3",
    address: "Đường Cách Mạng Tháng 8, P.10, Q.3",
    price: 3200000,
    area: 16,
    floor: 3,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    amenities: ["Chỉ nữ", "Camera khu", "Wifi", "Máy giặt chung", "Điều hòa"],
    description:
      "Khu trọ chỉ dành cho nữ, chủ nhà ở cùng tầng trệt. Gần công viên Lê Văn Tám.",
    contact: { phone: "0933 456 789", zalo: "0933456789" },
  },
  {
    id: "pt-009",
    title: "Phòng mới xây — có cửa sổ trời",
    district: "Quận 4",
    address: "Đường Tôn Đản, P.8, Q.4",
    price: 4100000,
    area: 24,
    floor: 4,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
    ],
    amenities: ["Cửa sổ trời", "Ban công", "Tủ lạnh", "Wifi", "Điều hòa"],
    description: "Nhà mới xây 2024, thông thoáng. Gần chợ Xóm Chiếu và cầu Calmette.",
    contact: { phone: "0977 222 111", zalo: "0977222111" },
  },
  {
    id: "pt-010",
    title: "Căn hộ dịch vụ — Phú Mỹ Hưng",
    district: "Quận 7",
    address: "Đường Nguyễn Đức Cảnh, P.Tân Phong, Q.7",
    price: 12500000,
    area: 45,
    floor: 8,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80",
    ],
    amenities: ["Full nội thất", "Bếp từ", "Máy sấy", "Gym", "Hồ bơi", "Bảo vệ"],
    description: "Phù hợp chuyên gia nước ngoài hoặc gia đình nhỏ. Cách Crescent Mall 3 phút.",
    contact: { phone: "028 5411 8888", zalo: "02854118888" },
  },
  {
    id: "pt-011",
    title: "Phòng giá rẻ — gần chợ Rạch Ông",
    district: "Quận 8",
    address: "Đường Âu Dương Lân, P.3, Q.8",
    price: 2200000,
    area: 14,
    floor: 1,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80",
    ],
    amenities: ["Quạt", "Wifi", "WC chung", "Để xe miễn phí"],
    description: "Ấm cúng, giá sinh viên. Gần chợ và nhiều quán ăn đêm.",
    contact: { phone: "0903 000 999", zalo: "0903000999" },
  },
  {
    id: "pt-012",
    title: "Phòng tầng trệt — có sân sau",
    district: "Tân Phú",
    address: "Đường Tân Thới Hòa, P.Tân Thới Hòa, Tân Phú",
    price: 3600000,
    area: 26,
    floor: 0,
    available: false,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    amenities: ["Sân sau riêng", "Cho nuôi pet", "Điều hòa", "Bếp nhỏ"],
    description: "Phù hợp người có xe máy lớn hoặc cần không gian phơi đồ.",
    contact: { phone: "0918 444 555", zalo: "0918444555" },
  },
  {
    id: "pt-013",
    title: "Homestay phòng đơn — Bình Tân",
    district: "Bình Tân",
    address: "Đường Kinh Dương Vương, P.An Lạc, Bình Tân",
    price: 3000000,
    area: 20,
    floor: 2,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    ],
    amenities: ["Điều hòa", "Wifi", "Dọn phòng tuần", "Bếp chung"],
    description: "Phong cách homestay, khu vực gần Aeon Mall Bình Tân.",
    contact: { phone: "0898 111 222", zalo: "0898111222" },
  },
  {
    id: "pt-014",
    title: "Phòng rộng — gần ĐHQG Thủ Đức",
    district: "Thủ Đức",
    address: "Đường Võ Văn Ngân, P.Linh Chiểu, TP.Thủ Đức",
    price: 4800000,
    area: 30,
    floor: 3,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    ],
    amenities: ["Điều hòa", "Bàn học", "Wifi", "Máy giặt", "Thang máy"],
    description: "Đông sinh viên, an ninh tốt. Đi bộ 10 phút tới ĐHQG.",
    contact: { phone: "0902 345 678", zalo: "0902345678" },
  },
  {
    id: "pt-015",
    title: "Phòng trong khu biệt — Nhà Bè",
    district: "Nhà Bè",
    address: "Đường Nguyễn Bình, Xã Nhơn Đức, Nhà Bè",
    price: 5500000,
    area: 40,
    floor: 2,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    amenities: ["Sân vườn chung", "Điều hòa", "Wifi", "Bảo vệ"],
    description: "Không gian yên tĩnh, gần cầu Phú Mỹ. Phù hợp làm việc remote.",
    contact: { phone: "0906 888 000", zalo: "0906888000" },
  },
  {
    id: "pt-016",
    title: "Phòng trọ công nhân — gần KCN",
    district: "Bình Chánh",
    address: "Đường Nguyễn Văn Linh, Xã Bình Hưng, Bình Chánh",
    price: 2500000,
    area: 15,
    floor: 1,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80",
    ],
    amenities: ["Quạt", "Wifi", "WC chung", "Điện theo giá nhà nước"],
    description: "Gần các khu công nghiệp và bến xe Miền Tây. Giờ giấc linh hoạt.",
    contact: { phone: "0900 777 888", zalo: "0900777888" },
  },
  {
    id: "pt-017",
    title: "Phòng gần ga Metro — Quận 12",
    district: "Quận 12",
    address: "Đường Tô Ký, P.Tân Chánh Hiệp, Q.12",
    price: 3900000,
    area: 23,
    floor: 3,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    ],
    amenities: ["Điều hòa", "Wifi", "Gần Metro", "Tủ lạnh mini"],
    description: "Cách ga Metro 5 phút đi bộ. Thuận tiện đi trung tâm.",
    contact: { phone: "0904 555 666", zalo: "0904555666" },
  },
  {
    id: "pt-018",
    title: "Phòng cổ điển — Chợ Lớn",
    district: "Quận 5",
    address: "Đường Nguyễn Trãi, P.14, Q.5",
    price: 3400000,
    area: 21,
    floor: 2,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    amenities: ["Điều hòa", "Wifi", "Gác nhỏ", "Gần chợ"],
    description: "Nhà cổ đã cải tạo, gần nhiều dịch vụ và quán ăn.",
    contact: { phone: "0911 333 444", zalo: "0911333444" },
  },
  {
    id: "pt-019",
    title: "Phòng penthouse mini — view cao",
    district: "Quận 10",
    address: "Đường Ba Tháng Hai, P.12, Q.10",
    price: 11000000,
    area: 45,
    floor: 8,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    amenities: ["View toàn cảnh", "Full nội thất", "Bếp từ", "Máy sấy", "Điều hòa"],
    description: "Tầng cao thoáng gió, nội thất cao cấp. Gần Bách Khoa và Y Dược.",
    contact: { phone: "0903 999 000", zalo: "0903999000" },
  },
  {
    id: "pt-020",
    title: "Phòng studio có sân phơi — Bình Thạnh",
    district: "Bình Thạnh",
    address: "Đường Phan Xích Long, P.3, Bình Thạnh",
    price: 6100000,
    area: 28,
    floor: 4,
    available: true,
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    ],
    amenities: ["Sân phơi riêng", "Điều hòa", "Wifi", "Bếp", "Thang máy"],
    description: "Khu Phan Xích Long sầm uất, tiện đi lại và ăn uống.",
    contact: { phone: "0907 121 212", zalo: "0907121212" },
  },
];

const defaultLegalGuidance = [
  "Ký hợp đồng thuê có thông tin CCCD/chủ hộ rõ ràng.",
  "Giữ biên nhận cọc và các khoản thu hàng tháng.",
  "Kiểm tra điều khoản trả cọc và báo trước khi trả phòng.",
];

const reviewAuthors = [
  "Người thuê cũ",
  "Sinh viên năm 2",
  "Nhân viên văn phòng",
  "Thực tập sinh",
  "Nghiên cứu sinh",
  "Freelancer",
];

const reviewTemplates = [
  "Phòng đúng mô tả, chủ trọ phản hồi nhanh khi cần hỗ trợ.",
  "Khu vực khá yên tĩnh buổi tối, đi lại thuận tiện vào giờ cao điểm.",
  "Chi phí phát sinh rõ ràng, không bị thu thêm ngoài thỏa thuận.",
  "An ninh ổn, hàng xóm thân thiện, phù hợp ở lâu dài.",
  "Internet ổn định cho học online và làm việc từ xa.",
  "Tiện nghi đủ dùng, đúng với mức giá trong khu vực.",
  "Không gian thoáng, ánh sáng tự nhiên tốt vào ban ngày.",
  "Vị trí gần chợ và xe buýt nên sinh hoạt hằng ngày rất tiện.",
];

const landlordIdsByRoomIndex = [
  "ld-001",
  "ld-001",
  "ld-002",
  "ld-003",
  "ld-002",
  "ld-001",
  "ld-004",
  "ld-004",
  "ld-003",
  "ld-005",
  "ld-005",
  "ld-006",
  "ld-006",
  "ld-002",
  "ld-006",
  "ld-005",
  "ld-003",
  "ld-004",
  "ld-001",
  "ld-002",
];

export const roomsMock: Room[] = rawRooms.map((room, index) => {
  const ratingBase = [5, 4, 5, 4, 4, 5, 5, 4][index] ?? 4;
  const isRoommateAvailable = index % 2 === 0;
  const reviewCount = 3 + (index % 3);
  const reviews = Array.from({ length: reviewCount }, (_, i) => {
    const author = reviewAuthors[(index + i) % reviewAuthors.length];
    const comment = reviewTemplates[(index * 2 + i) % reviewTemplates.length];
    const rating = Math.max(3, Math.min(5, ratingBase + ((index + i) % 3) - 1));
    return {
      id: `${room.id}-rv${i + 1}`,
      author,
      rating,
      comment,
    };
  });

  return {
    ...room,
    landlordId: landlordIdsByRoomIndex[index] ?? "ld-001",
    nearestSchoolKm: Number((0.6 + index * 0.4).toFixed(1)),
    verification: {
      landlordVerified: index !== 4,
      postVerified: index !== 5,
    },
    costBreakdown: {
      electricity: "3.800đ/kWh",
      water: "100.000đ/người",
      internet: "100.000đ/phòng",
      parking: "100.000đ/xe",
      other: "Rác + vệ sinh: 50.000đ/tháng",
      depositMonths: room.price >= 7_000_000 ? 2 : 1,
    },
    rentalConditions: [
      "Hợp đồng tối thiểu 6 tháng.",
      "Báo trước 30 ngày nếu trả phòng.",
      "Không gây ồn sau 22:00.",
    ],
    reviews,
    roommateMatching: {
      available: isRoommateAvailable,
      preference: isRoommateAvailable
        ? "Ưu tiên người gọn gàng, tôn trọng không gian chung."
        : undefined,
    },
    supportLanguages: ["Tiếng Việt", "English"],
    legalGuidance: defaultLegalGuidance,
  };
});

export const landlordsMock: Landlord[] = [
  {
    id: "ld-001",
    name: "Bốp Bốp",
    avatar: "https://35express.org/wp-content/uploads/2021/10/su-nghiep-noi-bat-cua-streamer-bop-bop-35express.jpg",
    phone: "0903 111 222",
    zalo: "0903111222",
    email: "bopbop@trohom.vn",
    bio: "Quản lý nhiều phòng studio và duplex khu trung tâm, hỗ trợ hợp đồng minh bạch.",
    experienceYears: 6,
    verified: true,
    languages: ["Tiếng Việt", "English"],
  },
  {
    id: "ld-002",
    name: "Trần Bình",
    avatar: "https://i.ytimg.com/vi/RPBHrQx4N2w/hqdefault.jpg",
    phone: "0902 345 678",
    zalo: "0902345678",
    email: "binh.tran@trohom.vn",
    bio: "Chuyên các phòng cho sinh viên, ưu tiên chi phí hợp lý và phản hồi nhanh.",
    experienceYears: 4,
    verified: true,
    languages: ["Tiếng Việt"],
  },
  {
    id: "ld-003",
    name: "Tài enzo",
    avatar: "https://i.ytimg.com/vi/sPMm-2dyXgo/oar2.jpg?sqp=-oaymwEYCJwEENAFSFqQAgHyq4qpAwcIARUAAIhC&rs=AOn4CLAAXT-OyWV9oXF7o3wAingdN8SU0A",
    phone: "0912 777 999",
    zalo: "0912777999",
    email: "enzo.tai@trohom.vn",
    bio: "Vận hành căn hộ mini và studio đầy đủ nội thất ở Bình Thạnh, Quận 4, Quận 12.",
    experienceYears: 5,
    verified: true,
    languages: ["Tiếng Việt", "English"],
  },
  {
    id: "ld-004",
    name: "Lai Bâng (tuất hết thời)",
    avatar: "https://cdn-img.thethao247.vn/origin_1920x0/upload/caodat/2020/11/08/bang-193105-1.jpg",
    phone: "0933 456 789",
    zalo: "0933456789",
    email: "bang.lai@trohom.vn",
    bio: "Phòng dành cho người đi làm và sinh viên nữ, chú trọng an ninh và môi trường sống.",
    experienceYears: 7,
    verified: true,
    languages: ["Tiếng Việt", "English"],
  },
  {
    id: "ld-005",
    name: "ADC(bố Lai Bâng)",
    avatar: "https://nguoinoitieng.tv/images/nnt/100/0/be2s.jpg",
    phone: "0903 111 222",
    zalo: "0903111222",
    email: "adc@trohom.vn",
    bio: "Chuyên căn hộ dịch vụ và phòng trung - cao cấp, hỗ trợ khách thuê nước ngoài.",
    experienceYears: 8,
    verified: true,
    languages: ["Tiếng Việt", "English"],
  },
  {
    id: "ld-006",
    name: "mcuong",
    avatar: "https://i.ytimg.com/vi/UjlRbdf2erw/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFggVShlMA8=&rs=AOn4CLAoRprS5GK5R7UOeaf4zIzze9l69Q",
    phone: "0906 888 000",
    zalo: "0906888000",
    email: "mcuong@trohom.vn",
    bio: "Phòng khu ven trung tâm, hợp đồng linh hoạt và hỗ trợ tìm người ở ghép.",
    experienceYears: 3,
    verified: true,
    languages: ["Tiếng Việt"],
  },
];

export type FeatureTodo = {
  id: string;
  title: string;
  status: "todo";
};

export const featureTodoList: FeatureTodo[] = [
  {
    id: "todo-01",
    title:
      "Tìm kiếm và lọc thông tin theo giá, vị trí, khoảng cách đến trường, tiện ích.",
    status: "todo",
  },
  {
    id: "todo-02",
    title:
      "Cung cấp thông tin minh bạch, bao gồm hình ảnh thực tế, chi phí chi tiết và điều kiện thuê.",
    status: "todo",
  },
  {
    id: "todo-03",
    title: "Xác thực chủ trọ và tin đăng, hạn chế tình trạng lừa đảo.",
    status: "todo",
  },
  {
    id: "todo-04",
    title: "Hệ thống đánh giá và phản hồi từ người thuê trước đó.",
    status: "todo",
  },
  {
    id: "todo-05",
    title:
      "Kết nối trực tiếp giữa sinh viên và chủ trọ, giảm phụ thuộc vào trung gian.",
    status: "todo",
  },
  {
    id: "todo-06",
    title: "Hỗ trợ tìm người ở ghép phù hợp.",
    status: "todo",
  },
  {
    id: "todo-07",
    title:
      "Hỗ trợ đa ngôn ngữ và hướng dẫn thủ tục pháp lý, đặc biệt cho sinh viên nước ngoài.",
    status: "todo",
  },
];

