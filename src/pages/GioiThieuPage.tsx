import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock,
  Headphones,
  Loader2,
  Mail,
  MapPinned,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const FORMSPREE_ENDPOINT = process.env.REACT_APP_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${process.env.REACT_APP_FORMSPREE_FORM_ID}`
  : "";

export function GioiThieuPage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [formMessage, setFormMessage] = useState<string | null>(null);

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormMessage(null);

    if (!FORMSPREE_ENDPOINT) {
      setFormStatus("error");
      setFormMessage(
        isEn
          ? "Missing REACT_APP_FORMSPREE_FORM_ID in .env — add your Formspree form ID and restart the dev server."
          : "Thiếu REACT_APP_FORMSPREE_FORM_ID trong file .env — thêm ID form Formspree rồi khởi động lại dev server."
      );
      return;
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) {
      setFormStatus("error");
      setFormMessage(
        isEn ? "Please enter your name and phone number." : "Vui lòng nhập tên và số điện thoại."
      );
      return;
    }

    setFormStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          _subject: isEn
            ? "[TroHom] Service inquiry"
            : "[TroHom] Liên hệ từ trang dịch vụ",
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
      setFormStatus("success");
      setName("");
      setPhone("");
      setFormMessage(
        isEn
          ? "Thank you — we will contact you soon."
          : "Cảm ơn bạn — chúng tôi sẽ liên hệ lại sớm."
      );
    } catch {
      setFormStatus("error");
      setFormMessage(
        isEn ? "Could not send. Please try again later." : "Gửi không thành công. Vui lòng thử lại sau."
      );
    }
  }

  const pillars = [
    {
      icon: BadgeCheck,
      title: isEn ? "Verified information" : "Thông tin được kiểm duyệt",
      text: isEn
        ? "Every listing is checked for address, pricing and photos to reduce fake posts."
        : "Mỗi tin đăng được rà soát địa chỉ, giá và hình ảnh, giúp bạn tránh tin ảo và nhận diện phòng phù hợp thật sự.",
    },
    {
      icon: Shield,
      title: isEn ? "Transparency & trust" : "Minh bạch & an tâm",
      text: isEn
        ? "Monthly pricing and amenities are displayed clearly before contact."
        : "Giá hiển thị rõ ràng theo tháng, mô tả tiện nghi đầy đủ — bạn biết mình đang xem gì trước khi liên hệ.",
    },
    {
      icon: Headphones,
      title: isEn ? "Support when needed" : "Đồng hành khi cần",
      text: isEn
        ? "Hotline and Zalo support for room viewings and rental steps."
        : "Kênh hotline và Zalo hỗ trợ giải đáp thắc mắc, hướng dẫn xem phòng và thủ tục thuê gọn gàng.",
    },
  ];

  const stats = [
    {
      value: "1000+",
      label: isEn ? "Monthly room searches" : "Lượt tìm phòng mỗi tháng",
      hint: isEn ? "Active users" : "Người dùng chủ động",
      icon: TrendingUp,
      accent: "from-teal-400/20 to-emerald-500/10",
    },
    {
      value: "50+",
      label: isEn ? "Covered districts" : "Khu vực được phủ sóng",
      hint: isEn ? "HCMC & nearby" : "TP.HCM & vùng lân cận",
      icon: MapPinned,
      accent: "from-cyan-400/20 to-teal-500/10",
    },
    {
      value: "24/7",
      label: isEn ? "Online support channels" : "Kênh liên hệ trực tuyến",
      hint: isEn ? "Hotline & consultation" : "Hotline & tư vấn",
      icon: Clock,
      accent: "from-emerald-400/20 to-cyan-500/10",
    },
  ];

  return (
    <div>
      {/* Một khối nền tối liền mạch từ dưới navbar (pt-24 = chừa header cố định) */}
      <div className="relative bg-surface-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-[0.85]" />
        <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-accent-light backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isEn ? "About TroHom" : "Giới thiệu TroHom"}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="max-w-3xl font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
          >
            {isEn ? "A trusted platform connecting " : "Nền tảng kết nối "}
            <span className="bg-gradient-to-r from-accent-light via-teal-200 to-cyan-200 bg-clip-text text-transparent">
              {isEn ? "tenants & landlords" : "người thuê & chủ trọ"}
            </span>{" "}
            {isEn ? "" : "uy tín"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            {isEn
              ? "TroHom delivers a clear, fast and reliable room-search experience."
              : "TroHom hướng tới trải nghiệm tìm phòng trọ rõ ràng, nhanh chóng và đáng tin cậy — từ lúc xem tin đến khi bạn chọn được nơi ở phù hợp."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/#rooms"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-dark px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              {isEn ? "View available rooms" : "Xem phòng đang mở"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:19001234"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              {isEn ? "Call support 1900 1234" : "Gọi tư vấn 1900 1234"}
            </a>
          </motion.div>
        </section>

        {/* Thống kê: nằm trong cùng nền tối, thẻ glass cao cấp */}
        <section className="relative border-t border-white/10 pb-4">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {isEn ? "Numbers that reflect quality" : "Con số nói thay chất lượng"}
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-accent/35 hover:shadow-[0_24px_60px_-12px_rgba(13,148,136,0.25)]"
                  >
                    <div
                      className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${s.accent} blur-2xl transition group-hover:opacity-100`}
                      aria-hidden
                    />
                    <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-light ring-1 ring-white/15">
                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                      </span>
                      <p className="font-display text-4xl font-bold tracking-tight text-white sm:text-[2.75rem]">
                        {s.value}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-200">
                        {s.label}
                      </p>
                      <p className="mt-1.5 text-xs text-slate-500">{s.hint}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bo cong chuyển sang nền sáng — không còn khe trắng dưới header */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <section className="border-b border-slate-200/90 bg-gradient-to-b from-slate-100 to-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-dark">
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              {isEn ? "Why choose TroHom?" : "Vì sao chọn TroHom?"}
            </h2>
            <p className="mt-3 text-slate-600">
              {isEn
                ? "Three pillars that make your room search safer and easier."
                : "Ba trụ cột giúp bạn yên tâm khi tìm phòng — không chỉ là danh sách, mà là trải nghiệm được thiết kế cho người thuê thực tế."}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.article
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-teal-500/10 text-accent-dark">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {pillar.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-accent-dark p-8 text-white shadow-soft sm:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-xl gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Users className="h-7 w-7 text-accent-light" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold sm:text-2xl">
                  {isEn
                    ? "Building a healthier rental community together"
                    : "Cùng nhau xây cộng đồng thuê phòng lành mạnh"}
                </h2>
                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  {isEn
                    ? "We keep improving listing quality and filters to save your time and reduce risk."
                    : "Chúng tôi không ngừng cải thiện nội dung hiển thị và công cụ lọc để bạn tiết kiệm thời gian, tránh rủi ro và chọn được chỗ ở đúng nhu cầu."}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">
                <Building2 className="h-4 w-4 text-accent-light" />
                {isEn ? "Wide district coverage" : "Đa dạng khu vực"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">
                <Shield className="h-4 w-4 text-accent-light" />
                {isEn ? "Transparency commitment" : "Cam kết minh bạch"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
          >
            <div className="mb-6 flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent-dark">
                <Mail className="h-6 w-6" strokeWidth={1.75} />
              </span>
            </div>
            <h2 className="text-center font-display text-xl font-bold text-slate-900 sm:text-2xl">
              {isEn ? "Leave your contact" : "Để lại thông tin liên hệ"}
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              {isEn
                ? "We will reach out to you about TroHom services."
                : "Chúng tôi sẽ liên hệ tư vấn về dịch vụ TroHom."}
            </p>
            <form onSubmit={handleContactSubmit} className="mt-8 space-y-5" noValidate>
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  {isEn ? "Full name" : "Họ và tên"}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={formStatus === "submitting"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-accent/0 transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
                  placeholder={isEn ? "Nguyen Van A" : "Nguyễn Văn A"}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                  {isEn ? "Phone number" : "Số điện thoại"}
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={formStatus === "submitting"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-accent/0 transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
                  placeholder={isEn ? "0901 234 567" : "0901 234 567"}
                />
              </div>
              {formMessage && (
                <p
                  role="alert"
                  className={`text-center text-sm ${
                    formStatus === "success" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-dark py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formStatus === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    {isEn ? "Sending…" : "Đang gửi…"}
                  </>
                ) : isEn ? (
                  "Send"
                ) : (
                  "Gửi thông tin"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
