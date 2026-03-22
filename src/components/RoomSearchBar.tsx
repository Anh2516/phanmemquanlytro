import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

export function RoomSearchBar({ value, onChange, id = "room-search" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <label htmlFor={id} className="sr-only">
        Tìm phòng
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-5">
        <Search
          className="h-5 w-5 text-slate-400"
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm phòng theo tên, khu vực, địa chỉ, tiện nghi…"
        autoComplete="off"
        className="h-14 w-full rounded-2xl border border-slate-200/90 bg-white pl-12 pr-12 text-[15px] text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.06)] outline-none ring-accent/0 transition placeholder:text-slate-400 focus:border-accent/40 focus:ring-4 focus:ring-accent/15 sm:h-[3.25rem] sm:pl-14 sm:pr-14 sm:text-base"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition hover:text-slate-600 sm:pr-4"
          aria-label="Xóa từ khóa"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
      ) : null}
    </motion.div>
  );
}
