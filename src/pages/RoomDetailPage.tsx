import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bath,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import clsx from "clsx";
import * as Tabs from "@radix-ui/react-tabs";
import { getLandlordById, getRoomById } from "../data/roomsApi";
import { useLanguage } from "../i18n/LanguageContext";
import type { Landlord } from "../types/landlord";
import type { Room } from "../types/room";

const formatMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

function mapsEmbedUrl(address: string) {
  const q = encodeURIComponent(`${address}, Việt Nam`);
  return `https://www.google.com/maps?q=${q}&output=embed&hl=vi`;
}

function mapsOpenUrl(address: string) {
  const q = encodeURIComponent(`${address}, Việt Nam`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function RoomDetailPage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomId]);

  useEffect(() => {
    if (room === undefined) return;
    if (room === null) {
      document.title = isEn ? "Not found | TroHom" : "Không tìm thấy | TroHom";
    } else {
      document.title = `${room.title} | TroHom`;
    }
    return () => {
      document.title = isEn ? "TroHom — Room rentals" : "TroHom — Cho thuê phòng trọ";
    };
  }, [room, isEn]);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      setLandlord(null);
      return;
    }
    setRoom(undefined);
    setLandlord(null);
    let cancelled = false;
    getRoomById(roomId).then((r) => {
      if (!cancelled) {
        setRoom(r ?? null);
        if (r) {
          getLandlordById(r.landlordId).then((profile) => {
            if (!cancelled) setLandlord(profile ?? null);
          });
        } else {
          setLandlord(null);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  useEffect(() => {
    setImgIndex(0);
  }, [roomId]);

  if (room === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <span>{isEn ? "Loading room details..." : "Đang tải thông tin phòng…"}</span>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          {isEn ? "Room not found" : "Không tìm thấy phòng"}
        </h1>
        <p className="mt-2 text-slate-600">
          {isEn
            ? "Invalid link or the listing was removed."
            : "Đường dẫn không đúng hoặc phòng đã gỡ khỏi hệ thống."}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {isEn ? "Back to home" : "Về trang chủ"}
        </Link>
      </div>
    );
  }

  const images = room.images;
  const go = (dir: -1 | 1) => {
    setImgIndex((i) => (i + dir + images.length) % images.length);
  };

  const phoneClean = room.contact.phone.replace(/\s/g, "");
  const zalo = room.contact.zalo?.replace(/\s/g, "");
  const avgRating =
    room.reviews.reduce((sum, rv) => sum + rv.rating, 0) / room.reviews.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="pb-16 pt-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-accent-dark">
            {isEn ? "Home" : "Trang chủ"}
          </Link>
          <span aria-hidden>/</span>
          <Link to="/#rooms" className="transition hover:text-accent-dark">
            {isEn ? "Rooms" : "Danh sách phòng"}
          </Link>
          <span aria-hidden>/</span>
          <span className="font-medium text-slate-800 line-clamp-1">
            {room.title}
          </span>
        </nav>

        <Link
          to="/#rooms"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-accent-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          {isEn ? "Back to list" : "Quay lại danh sách"}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-soft">
              <div className="relative aspect-[16/10]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={imgIndex}
                    src={images[imgIndex]}
                    alt=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label={isEn ? "Previous image" : "Ảnh trước"}
                      onClick={() => go(-1)}
                      className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/60"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      aria-label={isEn ? "Next image" : "Ảnh sau"}
                      onClick={() => go(1)}
                      className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/60"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <span
                  className={clsx(
                    "absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md",
                    room.available
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-900/90 text-white"
                  )}
                >
                  {room.available ? (isEn ? "Available" : "Còn trống") : isEn ? "Rented" : "Đã thuê"}
                </span>
              </div>

              <Tabs.Root
                value={String(imgIndex)}
                onValueChange={(v) => setImgIndex(Number(v))}
                className="border-t border-slate-200 bg-slate-50 px-2 pt-2"
              >
                <Tabs.List className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((src, i) => (
                    <Tabs.Trigger
                      key={src}
                      value={String(i)}
                      className={clsx(
                        "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition",
                        imgIndex === i
                          ? "border-accent ring-2 ring-accent/30"
                          : "border-transparent opacity-75 hover:opacity-100"
                      )}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                {room.title}
              </h2>
              <p className="mt-3 flex items-start gap-2 text-slate-600">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>{room.address}</span>
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {room.description}
              </p>
            </section>

            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <Sparkles className="h-5 w-5 text-accent" />
                {isEn ? "Amenities" : "Tiện nghi"}
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {room.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 rounded-xl bg-accent/5 px-4 py-3 text-sm font-medium text-slate-800"
                  >
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {isEn ? "Detailed costs & rental terms" : "Chi phí chi tiết & điều kiện thuê"}
              </h3>
              <ul className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <li className="rounded-xl bg-slate-50 px-4 py-3">
                  {isEn ? "Electricity" : "Điện"}: {room.costBreakdown.electricity}
                </li>
                <li className="rounded-xl bg-slate-50 px-4 py-3">
                  {isEn ? "Water" : "Nước"}: {room.costBreakdown.water}
                </li>
                <li className="rounded-xl bg-slate-50 px-4 py-3">
                  Internet: {room.costBreakdown.internet}
                </li>
                <li className="rounded-xl bg-slate-50 px-4 py-3">
                  {isEn ? "Parking" : "Gửi xe"}: {room.costBreakdown.parking}
                </li>
                <li className="rounded-xl bg-slate-50 px-4 py-3 sm:col-span-2">
                  {isEn ? "Other" : "Khác"}: {room.costBreakdown.other}
                </li>
                <li className="rounded-xl bg-accent/10 px-4 py-3 font-medium text-accent-dark sm:col-span-2">
                  {isEn ? "Deposit" : "Tiền cọc"}: {room.costBreakdown.depositMonths}{" "}
                  {isEn ? "month(s)" : "tháng"}
                </li>
              </ul>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {room.rentalConditions.map((condition) => (
                  <li key={condition} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-accent" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <Star className="h-5 w-5 text-amber-500" />
                {isEn ? "Reviews from previous tenants" : "Đánh giá từ người thuê trước"}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {isEn ? "Average rating: " : "Điểm trung bình: "}
                <span className="font-semibold text-slate-900">
                  {avgRating.toFixed(1)}/5
                </span>
              </p>
              <div className="mt-4 space-y-3">
                {room.reviews.map((rv) => (
                  <article key={rv.id} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {rv.author} · {rv.rating}/5
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{rv.comment}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <MapPin className="h-5 w-5 text-accent" />
                {isEn ? "Location on map" : "Vị trí trên bản đồ"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {isEn
                  ? `${room.address} — open in full screen with Google Maps.`
                  : `${room.address} — bạn có thể mở toàn màn hình trong Google Maps.`}
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                <iframe
                  title={isEn ? "Map" : "Bản đồ"}
                  src={mapsEmbedUrl(room.address)}
                  className="aspect-[16/10] w-full border-0 sm:h-[380px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={mapsOpenUrl(room.address)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-dark hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                {isEn ? "Open address in Google Maps" : "Mở địa chỉ trong Google Maps"}
              </a>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {isEn ? "Rent" : "Giá thuê"}
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-accent-dark">
                {formatMoney(room.price)}
                <span className="text-lg font-normal text-slate-500">
                  {" "}
                  {isEn ? "/month" : "/tháng"}
                </span>
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-slate-400" />
                  <span>
                    <span className="text-slate-400">{isEn ? "District:" : "Khu vực:"}</span>{" "}
                    {room.district}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-slate-400" />
                  <span>
                    <span className="text-slate-400">{isEn ? "Area:" : "Diện tích:"}</span>{" "}
                    {room.area} m²
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Bath className="h-5 w-5 text-slate-400" />
                  <span>
                    <span className="text-slate-400">{isEn ? "Floor:" : "Tầng:"}</span> {room.floor}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <span>
                    <span className="text-slate-400">
                      {isEn ? "Distance to school:" : "Cách trường:"}
                    </span>{" "}
                    {room.nearestSchoolKm.toFixed(1)} km
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <span className="leading-snug">{room.address}</span>
                </li>
              </ul>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {isEn ? "Verification & roommate" : "Xác thực & ở ghép"}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold",
                      room.verification.landlordVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {room.verification.landlordVerified
                      ? isEn
                        ? "Landlord verified"
                        : "Chủ trọ đã xác thực"
                      : isEn
                        ? "Landlord pending verification"
                        : "Chủ trọ chờ xác thực"}
                  </span>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold",
                      room.verification.postVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {room.verification.postVerified
                      ? isEn
                        ? "Listing verified"
                        : "Tin đăng đã xác thực"
                      : isEn
                        ? "Listing pending verification"
                        : "Tin đăng chờ xác thực"}
                  </span>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold",
                      room.roommateMatching.available
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {room.roommateMatching.available
                      ? isEn
                        ? "Roommate support available"
                        : "Có hỗ trợ tìm người ở ghép"
                      : isEn
                        ? "No roommate option yet"
                        : "Chưa mở ghép phòng"}
                  </span>
                </div>
                {room.roommateMatching.preference && (
                  <p className="text-sm text-slate-600">
                    {room.roommateMatching.preference}
                  </p>
                )}
              </div>

              <div className="mt-8 space-y-3 border-t border-slate-100 pt-8">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {isEn ? "Contact" : "Liên hệ"}
                </p>
                <a
                  href={`tel:${phoneClean}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Phone className="h-5 w-5" />
                  {isEn ? "Call" : "Gọi"} {room.contact.phone}
                </a>
                {zalo && (
                  <a
                    href={`https://zalo.me/${zalo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0068ff] bg-[#0068ff]/5 px-4 py-3.5 text-sm font-semibold text-[#0068ff] transition hover:bg-[#0068ff]/10"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {isEn ? "Chat on Zalo" : "Chat Zalo"}
                  </a>
                )}
                {landlord && (
                  <Link
                    to={`/landlord/${landlord.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {isEn
                      ? `View landlord profile: ${landlord.name}`
                      : `Xem hồ sơ chủ trọ: ${landlord.name}`}
                  </Link>
                )}
              </div>

              <p className="mt-6 text-center text-xs text-slate-400">
                {isEn ? "Room ID:" : "Mã phòng:"}{" "}
                <span className="font-mono text-slate-600">{room.id}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
