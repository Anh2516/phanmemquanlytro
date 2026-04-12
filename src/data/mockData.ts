import type { Room, RawRoom } from "../types/room";
import type { Landlord } from "../types/landlord";
import { landlordsData } from "./landlordsRaw.data";
import { rawRooms } from "./roomsRaw.data";

export const landlordsMock: Landlord[] = landlordsData;

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

const defaultRentalConditions = [
  "Hợp đồng tối thiểu 6 tháng.",
  "Báo trước 30 ngày nếu trả phòng.",
  "Không gây ồn sau 22:00.",
];

function defaultCostBreakdown(price: number) {
  return {
    electricity: "3.800đ/kWh",
    water: "100.000đ/người",
    internet: "100.000đ/phòng",
    parking: "100.000đ/xe",
    other: "Rác + vệ sinh: 50.000đ/tháng",
    depositMonths: price >= 7_000_000 ? 2 : 1,
  };
}

export function buildRoomsFromRaw(rawList: RawRoom[]): Room[] {
  return rawList.map((room, index) => {
    const {
      costBreakdown: rawCost,
      rentalConditions: rawRental,
      reviews: rawReviews,
      mapSearchQuery,
      ...rest
    } = room;

    const ratingBase = [5, 4, 5, 4, 4, 5, 5, 4][index] ?? 4;
    const isRoommateAvailable = index % 2 === 0;
    const reviewCount = 3 + (index % 3);
    const autoReviews = Array.from({ length: reviewCount }, (_, i) => {
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

    const reviews =
      rawReviews === undefined
        ? autoReviews
        : rawReviews.map((r, i) => ({
            id: `${room.id}-rv${i + 1}`,
            author: r.author,
            rating: Math.max(1, Math.min(5, Math.round(Number(r.rating) || 0))),
            comment: r.comment,
          }));

    const mapQ = mapSearchQuery?.trim();

    return {
      ...rest,
      landlordId: room.landlordId ?? landlordIdsByRoomIndex[index] ?? "ld-001",
      mapSearchQuery: mapQ || undefined,
      nearestSchoolKm: Number((0.6 + index * 0.4).toFixed(1)),
      verification: {
        landlordVerified: index !== 4,
        postVerified: index !== 5,
      },
      costBreakdown: rawCost ?? defaultCostBreakdown(rest.price),
      rentalConditions: rawRental ?? [...defaultRentalConditions],
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
}

export const roomsMock: Room[] = buildRoomsFromRaw(rawRooms);

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

