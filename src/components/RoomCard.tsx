import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bath, ChevronRight, MapPin, Maximize2, Tag } from "lucide-react";
import type { Room } from "../types/room";
import clsx from "clsx";

const MotionLink = motion.create(Link);

type Props = {
  room: Room;
  index: number;
};

const formatMoney = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

export function RoomCard({ room, index }: Props) {
  const cover = room.images[0];

  return (
    <MotionLink
      to={`/room/${room.id}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative block aspect-[4/3] w-full overflow-hidden">
        <motion.img
          src={cover}
          alt={room.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={clsx(
            "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
            room.available
              ? "bg-emerald-500/95 text-white"
              : "bg-slate-900/80 text-white"
          )}
        >
          {room.available ? "Còn trống" : "Đã thuê"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug text-slate-900 line-clamp-2">
            {room.title}
          </h3>
        </div>
        <p className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-accent" />
          <span className="line-clamp-1">{room.district}</span>
        </p>
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
            <Maximize2 className="h-3.5 w-3.5" />
            {room.area} m²
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
            <Bath className="h-3.5 w-3.5" />
            Tầng {room.floor}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="flex items-baseline gap-1">
            <Tag className="h-4 w-4 text-accent" />
            <span className="font-display text-xl font-bold text-accent-dark">
              {formatMoney(room.price)}
            </span>
            <span className="text-xs text-slate-400">/tháng</span>
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-accent-dark">
            Chi tiết
            <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </MotionLink>
  );
}
