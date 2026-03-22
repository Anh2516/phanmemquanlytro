import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: BadgeCheck,
    eyebrow: "Uy tín",
    title: "Phòng tin cậy",
    desc: "Thông tin được kiểm duyệt, minh bạch giá và địa chỉ trước khi bạn liên hệ.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "An tâm",
    title: "Giao dịch rõ ràng",
    desc: "Quy trình thuê minh bạch, bảo vệ quyền lợi người thuê và chủ nhà.",
  },
  {
    icon: Headphones,
    eyebrow: "Đồng hành",
    title: "Hỗ trợ tận tâm",
    desc: "Hotline & tư vấn trực tuyến — sẵn sàng khi bạn cần xem phòng hoặc thắc mắc.",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-surface-950 pb-20 pt-28 sm:pb-28 sm:pt-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-mesh" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent-light backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Phòng trọ chọn lọc — cập nhật mỗi tuần
          </motion.div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tìm phòng trọ{" "}
            <span className="bg-gradient-to-r from-accent-light to-teal-200 bg-clip-text text-transparent">
              nhanh &amp; rõ ràng
            </span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 sm:text-xl">
            Kết nối bạn với phòng trọ phù hợp — lọc theo khu vực và ngân sách,
            thông tin rõ ràng để bạn an tâm lựa chọn.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.a
              href="#rooms"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-dark px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition"
            >
              Xem phòng đang mở
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <Link
              to="/gioi-thieu"
              className="text-sm font-semibold text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              Tìm hiểu về dịch vụ
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid gap-4 sm:grid-cols-3"
        >
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 backdrop-blur-sm transition hover:border-accent/30 hover:from-white/[0.1]"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20"
                  aria-hidden
                />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent-light ring-1 ring-white/10">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-light/90">
                      {item.eyebrow}
                    </span>
                  </div>
                  <p className="font-display text-lg font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
