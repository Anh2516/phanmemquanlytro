import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Building2, Mail, MessageCircle, Phone } from "lucide-react";
import { getLandlordById, getRoomsByLandlordId } from "../data/roomsApi";
import { useLanguage } from "../i18n/LanguageContext";
import type { Landlord } from "../types/landlord";
import type { Room } from "../types/room";
import { RoomCard } from "../components/RoomCard";

export function LandlordProfilePage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { landlordId } = useParams<{ landlordId: string }>();
  const [landlord, setLandlord] = useState<Landlord | null | undefined>(undefined);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!landlordId) {
      setLandlord(null);
      return;
    }
    let cancelled = false;
    Promise.all([getLandlordById(landlordId), getRoomsByLandlordId(landlordId)]).then(
      ([profile, roomList]) => {
        if (cancelled) return;
        setLandlord(profile ?? null);
        setRooms(roomList);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [landlordId]);

  const phoneClean = useMemo(
    () => landlord?.phone.replace(/\s/g, "") ?? "",
    [landlord?.phone]
  );
  const zalo = useMemo(() => landlord?.zalo?.replace(/\s/g, "") ?? "", [landlord?.zalo]);

  if (landlord === undefined) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 pt-24 text-slate-500 sm:px-6">
        {isEn ? "Loading landlord profile..." : "Đang tải hồ sơ chủ trọ..."}
      </div>
    );
  }

  if (landlord === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          {isEn ? "Landlord not found" : "Không tìm thấy chủ trọ"}
        </h1>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {isEn ? "Back to home" : "Về trang chủ"}
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
      <Link
        to="/#rooms"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-accent-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        {isEn ? "Back to room list" : "Quay lại danh sách phòng"}
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={landlord.avatar}
              alt={landlord.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-200"
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">{landlord.name}</h1>
              <p className="mt-1 text-sm text-slate-600">{landlord.bio}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                  {isEn
                    ? `${landlord.experienceYears} years experience`
                    : `${landlord.experienceYears} năm kinh nghiệm`}
                </span>
                {landlord.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {isEn ? "Verified landlord" : "Chủ trọ đã xác thực"}
                  </span>
                )}
                {landlord.languages.map((lang) => (
                  <span key={lang} className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${phoneClean}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Phone className="h-4 w-4" />
              {isEn ? "Call" : "Gọi"} {landlord.phone}
            </a>
            {zalo && (
              <a
                href={`https://zalo.me/${zalo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#0068ff] px-4 py-2.5 text-sm font-semibold text-[#0068ff]"
              >
                <MessageCircle className="h-4 w-4" />
                Zalo
              </a>
            )}
            <a
              href={`mailto:${landlord.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
        </div>
      </motion.section>

      <section className="mt-10">
        <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-slate-900">
          <Building2 className="h-5 w-5 text-accent" />
          {isEn ? "Rooms from this landlord" : "Các phòng của chủ trọ này"} ({rooms.length})
        </h2>
        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
            {isEn ? "No active listings yet." : "Chưa có phòng nào đang hiển thị."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
