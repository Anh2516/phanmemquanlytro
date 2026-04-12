import type { RawRoom } from "../types/room";
import { buildRoomsFromRaw } from "../data/mockData";

/** Chuẩn hoá raw để form admin luôn có đủ block chi phí / điều kiện / đánh giá / bản đồ. */
export function fillRawRoomForAdmin(room: RawRoom): RawRoom {
  const built = buildRoomsFromRaw([room])[0]!;
  return {
    ...room,
    costBreakdown: room.costBreakdown
      ? { ...room.costBreakdown }
      : { ...built.costBreakdown },
    rentalConditions:
      room.rentalConditions !== undefined ? [...room.rentalConditions] : [...built.rentalConditions],
    reviews:
      room.reviews !== undefined
        ? room.reviews.map((r) => ({ ...r }))
        : built.reviews.map(({ author, rating, comment }) => ({ author, rating, comment })),
    mapSearchQuery: room.mapSearchQuery ?? "",
  };
}
