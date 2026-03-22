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
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import * as Tabs from "@radix-ui/react-tabs";
import { getRoomById } from "../data/roomsApi";
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
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomId]);

  useEffect(() => {
    if (room === undefined) return;
    if (room === null) {
      document.title = "Không tìm thấy | TroHom";
    } else {
      document.title = `${room.title} | TroHom`;
    }
    return () => {
      document.title = "TroHom — Cho thuê phòng trọ";
    };
  }, [room]);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      return;
    }
    setRoom(undefined);
    let cancelled = false;
    getRoomById(roomId).then((r) => {
      if (!cancelled) setRoom(r ?? null);
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
        <span>Đang tải thông tin phòng…</span>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Không tìm thấy phòng
        </h1>
        <p className="mt-2 text-slate-600">
          Đường dẫn không đúng hoặc phòng đã gỡ khỏi hệ thống.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
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
            Trang chủ
          </Link>
          <span aria-hidden>/</span>
          <Link to="/#rooms" className="transition hover:text-accent-dark">
            Danh sách phòng
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
          Quay lại danh sách
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
                      aria-label="Ảnh trước"
                      onClick={() => go(-1)}
                      className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/60"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      aria-label="Ảnh sau"
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
                  {room.available ? "Còn trống" : "Đã thuê"}
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
                Tiện nghi
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

            <section className="mt-10">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <MapPin className="h-5 w-5 text-accent" />
                Vị trí trên bản đồ
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {room.address} — bạn có thể mở toàn màn hình trong Google Maps.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                <iframe
                  title="Bản đồ"
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
                Mở địa chỉ trong Google Maps
              </a>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Giá thuê
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-accent-dark">
                {formatMoney(room.price)}
                <span className="text-lg font-normal text-slate-500">
                  {" "}
                  /tháng
                </span>
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-slate-400" />
                  <span>
                    <span className="text-slate-400">Khu vực:</span>{" "}
                    {room.district}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-slate-400" />
                  <span>
                    <span className="text-slate-400">Diện tích:</span>{" "}
                    {room.area} m²
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Bath className="h-5 w-5 text-slate-400" />
                  <span>
                    <span className="text-slate-400">Tầng:</span> {room.floor}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <span className="leading-snug">{room.address}</span>
                </li>
              </ul>

              <div className="mt-8 space-y-3 border-t border-slate-100 pt-8">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Liên hệ
                </p>
                <a
                  href={`tel:${phoneClean}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Phone className="h-5 w-5" />
                  Gọi {room.contact.phone}
                </a>
                {zalo && (
                  <a
                    href={`https://zalo.me/${zalo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0068ff] bg-[#0068ff]/5 px-4 py-3.5 text-sm font-semibold text-[#0068ff] transition hover:bg-[#0068ff]/10"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat Zalo
                  </a>
                )}
              </div>

              <p className="mt-6 text-center text-xs text-slate-400">
                Mã phòng: <span className="font-mono text-slate-600">{room.id}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
