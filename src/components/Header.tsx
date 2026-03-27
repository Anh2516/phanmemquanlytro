import { motion } from "framer-motion";
import { Home, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  const isEn = language === "en";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-surface-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-dark shadow-glow">
            <Home className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            TroHom<span className="text-accent-light">.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 sm:flex">
          <Link to="/#rooms" className="transition hover:text-white">
            {isEn ? "Room list" : "Danh sách phòng"}
          </Link>
          <Link to="/gioi-thieu" className="transition hover:text-white">
            {isEn ? "About service" : "Về dịch vụ"}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            aria-label={isEn ? "Switch to Vietnamese" : "Switch to English"}
          >
            {isEn ? "VI" : "EN"}
          </button>
          <a
            href="tel:19001234"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <Phone className="h-4 w-4 text-accent-light" />
            <span className="hidden sm:inline">1900 1234</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
