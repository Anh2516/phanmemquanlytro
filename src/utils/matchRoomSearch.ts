import type { Room } from "../types/room";

/** Chuẩn hóa chữ để tìm gần đúng (không phân biệt hoa thường, bỏ dấu nhẹ). */
function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchRoomSearch(room: Room, rawQuery: string): boolean {
  const q = rawQuery.trim();
  if (!q) return true;
  const needle = fold(q);
  const hay = fold(
    [
      room.title,
      room.district,
      room.address,
      room.description,
      room.id,
      String(room.price),
      String(room.nearestSchoolKm),
      room.verification.landlordVerified ? "chủ trọ đã xác thực" : "chủ trọ chưa xác thực",
      room.verification.postVerified ? "tin đã xác thực" : "tin chưa xác thực",
      ...room.rentalConditions,
      ...room.supportLanguages,
      ...room.legalGuidance,
      ...room.amenities,
    ].join(" ")
  );
  return hay.includes(needle);
}
