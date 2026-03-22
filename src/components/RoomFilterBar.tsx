import * as Select from "@radix-ui/react-select";
import { motion } from "framer-motion";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  districts: string[];
  district: string;
  onDistrictChange: (v: string) => void;
  onlyAvailable: boolean;
  onOnlyAvailableChange: (v: boolean) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
  priceCeiling: number;
};

export function RoomFilterBar({
  districts,
  district,
  onDistrictChange,
  onlyAvailable,
  onOnlyAvailableChange,
  maxPrice,
  onMaxPriceChange,
  priceCeiling,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        <SlidersHorizontal className="h-3.5 w-3.5 text-accent" aria-hidden />
        Bộ lọc
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-6">
        <div className="min-w-0 flex-1 lg:max-w-xs">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Khu vực
          </label>
          <Select.Root value={district} onValueChange={onDistrictChange}>
            <Select.Trigger
              className={clsx(
                "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-800 shadow-sm",
                "outline-none ring-accent/0 transition hover:border-slate-300 focus:border-accent/40 focus:ring-4 focus:ring-accent/15"
              )}
              aria-label="Khu vực"
            >
              <Select.Value placeholder="Tất cả" />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="z-[100] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                position="popper"
                sideOffset={6}
              >
                <Select.Viewport className="p-1">
                  <SelectItem value="all">Tất cả khu vực</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-md">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Giá tối đa / tháng
          </label>
          <input
            type="range"
            min={2_000_000}
            max={priceCeiling}
            step={500_000}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer rounded-full accent-accent"
          />
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(maxPrice)}
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 lg:shrink-0 lg:self-end">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => onOnlyAvailableChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
          />
          <span className="text-sm font-medium text-slate-700">
            Chỉ phòng còn trống
          </span>
        </label>
      </div>
    </motion.div>
  );
}

function SelectItem({ value, children }: { value: string; children: ReactNode }) {
  return (
    <Select.Item
      value={value}
      className={clsx(
        "relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm text-slate-800",
        "outline-none data-[highlighted]:bg-accent/10 data-[state=checked]:font-semibold"
      )}
    >
      <Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Check className="h-3.5 w-3.5 text-accent" />
      </Select.ItemIndicator>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}
