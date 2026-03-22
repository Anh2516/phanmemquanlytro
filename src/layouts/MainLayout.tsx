import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-50 text-slate-900">
      <Header />
      <Outlet />
      <footer
        id="about"
        className="border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500"
      >
        <p className="font-display text-slate-800">
          TroHom — demo cho thuê phòng trọ
        </p>
        <p className="mt-2">
          UI: Tailwind CSS · Animation: Framer Motion · Radix UI · Lucide ·
          React Router
        </p>
      </footer>
    </div>
  );
}
