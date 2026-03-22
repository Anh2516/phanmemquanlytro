import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "../components/Hero";
import { RoomCard } from "../components/RoomCard";
import { RoomFilterBar } from "../components/RoomFilterBar";
import { RoomSearchBar } from "../components/RoomSearchBar";
import { loadRooms } from "../data/roomsApi";
import type { Room } from "../types/room";
import { matchRoomSearch } from "../utils/matchRoomSearch";
import { Loader2 } from "lucide-react";

export function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10_000_000);

  useEffect(() => {
    let cancelled = false;
    loadRooms()
      .then((data) => {
        if (!cancelled) {
          setRooms(data);
          if (data.length > 0) {
            setMaxPrice(Math.max(...data.map((r) => r.price), 10_000_000));
          }
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Không tải được dữ liệu");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const districts = useMemo(
    () => Array.from(new Set(rooms.map((r) => r.district))).sort(),
    [rooms]
  );

  const priceCeiling = useMemo(() => {
    if (rooms.length === 0) return 10_000_000;
    return Math.max(10_000_000, ...rooms.map((r) => r.price));
  }, [rooms]);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (!matchRoomSearch(r, search)) return false;
      if (district !== "all" && r.district !== district) return false;
      if (onlyAvailable && !r.available) return false;
      if (r.price > maxPrice) return false;
      return true;
    });
  }, [rooms, search, district, onlyAvailable, maxPrice]);

  return (
    <>
      <Hero />

      <main id="rooms" className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <div className="mb-8 border-b border-slate-200/90 pb-8 sm:mb-10 sm:pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="max-w-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
                Danh mục
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Phòng đang cho thuê
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                Khám phá phòng trọ phù hợp — gõ từ khóa để lọc nhanh theo khu vực,
                tên đường hoặc tiện nghi bạn cần.
              </p>
            </motion.div>
            <div className="w-full min-w-0 flex-1 lg:max-w-xl">
              <RoomSearchBar value={search} onChange={setSearch} />
            </div>
          </div>

          {!loading && !error && rooms.length > 0 && (
            <RoomFilterBar
              districts={districts}
              district={district}
              onDistrictChange={setDistrict}
              onlyAvailable={onlyAvailable}
              onOnlyAvailableChange={setOnlyAvailable}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              priceCeiling={priceCeiling}
            />
          )}
        </div>

        {loading && (
          <div className="flex min-h-[200px] items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            Đang tải danh sách…
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {rooms.length > 0 && (
              <p className="mb-6 text-sm text-slate-500">
                {search.trim() ? (
                  filtered.length === 0 ? (
                    <>
                      Không có kết quả cho &quot;{search.trim()}&quot;
                    </>
                  ) : (
                    <>
                      Tìm thấy{" "}
                      <span className="font-semibold text-slate-800">
                        {filtered.length}
                      </span>{" "}
                      phòng phù hợp
                    </>
                  )
                ) : (
                  <>
                    <span className="font-semibold text-slate-800">
                      {filtered.length}
                    </span>{" "}
                    phòng đang mở
                  </>
                )}
              </p>
            )}

            {rooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center text-slate-600">
                Hiện chưa có tin phòng. Vui lòng quay lại sau.
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                <p className="font-medium text-slate-700">
                  Chưa có phòng nào khớp tìm kiếm
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Thử đổi từ khóa, nới giá tối đa, chọn &quot;Tất cả khu vực&quot;
                  hoặc bỏ chọn &quot;Chỉ phòng còn trống&quot;.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((room, index) => (
                  <RoomCard key={room.id} room={room} index={index} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </main>
    </>
  );
}
