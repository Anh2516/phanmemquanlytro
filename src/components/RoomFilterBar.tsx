import * as Select from "@radix-ui/react-select";
import { motion } from "framer-motion";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useLanguage } from "../i18n/LanguageContext";

type Props = {
  districts: string[];
  district: string;
  onDistrictChange: (v: string) => void;
  amenities: string[];
  amenity: string;
  onAmenityChange: (v: string) => void;
  onlyAvailable: boolean;
  onOnlyAvailableChange: (v: boolean) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
  priceCeiling: number;
  maxSchoolDistanceKm: number;
  onMaxSchoolDistanceKmChange: (v: number) => void;
  onlyRoommateMatching: boolean;
  onOnlyRoommateMatchingChange: (v: boolean) => void;
};

export function RoomFilterBar({
  districts,
  district,
  onDistrictChange,
  amenities,
  amenity,
  onAmenityChange,
  onlyAvailable,
  onOnlyAvailableChange,
  maxPrice,
  onMaxPriceChange,
  priceCeiling,
  maxSchoolDistanceKm,
  onMaxSchoolDistanceKmChange,
  onlyRoommateMatching,
  onOnlyRoommateMatchingChange,
}: Props) {
  const { language } = useLanguage();
  const isEn = language === "en";

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
        {isEn ? "Filters" : "Bộ lọc"}
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:gap-6">
        <div className="min-w-0 flex-1 lg:max-w-xs">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            {isEn ? "District" : "Khu vực"}
          </label>
          <Select.Root value={district} onValueChange={onDistrictChange}>
            <Select.Trigger
              className={clsx(
                "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-800 shadow-sm",
                "outline-none ring-accent/0 transition hover:border-slate-300 focus:border-accent/40 focus:ring-4 focus:ring-accent/15"
              )}
              aria-label={isEn ? "District" : "Khu vực"}
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
                  <SelectItem value="all">{isEn ? "All districts" : "Tất cả khu vực"}</SelectItem>
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

        <div className="min-w-0 flex-1 lg:max-w-xs">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            {isEn ? "Amenities" : "Tiện ích"}
          </label>
          <Select.Root value={amenity} onValueChange={onAmenityChange}>
            <Select.Trigger
              className={clsx(
                "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-800 shadow-sm",
                "outline-none ring-accent/0 transition hover:border-slate-300 focus:border-accent/40 focus:ring-4 focus:ring-accent/15"
              )}
              aria-label={isEn ? "Amenities" : "Tiện ích"}
            >
              <Select.Value placeholder="Tất cả tiện ích" />
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
                  <SelectItem value="all">{isEn ? "All amenities" : "Tất cả tiện ích"}</SelectItem>
                  {amenities.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-md">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            {isEn ? "Max monthly rent" : "Giá tối đa / tháng"}
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
            {new Intl.NumberFormat(isEn ? "en-US" : "vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(maxPrice)}
          </p>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-md">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            {isEn ? "Max distance to school" : "Khoảng cách tối đa đến trường"}
          </label>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={maxSchoolDistanceKm}
            onChange={(e) => onMaxSchoolDistanceKmChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer rounded-full accent-accent"
          />
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {isEn
              ? `At most ${maxSchoolDistanceKm.toFixed(1)} km`
              : `Dưới hoặc bằng ${maxSchoolDistanceKm.toFixed(1)} km`}
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
            {isEn ? "Available rooms only" : "Chỉ phòng còn trống"}
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 lg:shrink-0 lg:self-end">
          <input
            type="checkbox"
            checked={onlyRoommateMatching}
            onChange={(e) => onOnlyRoommateMatchingChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
          />
          <span className="text-sm font-medium text-slate-700">
            {isEn ? "Roommate support" : "Có hỗ trợ ở ghép"}
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
