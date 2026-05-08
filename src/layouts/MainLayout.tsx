import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-50 text-slate-900">
      <Header />
      <Outlet />
      <footer
        id="about"
        className="mt-12 bg-[#138f89] text-white"
      >
        <div className="w-full px-4 py-8 text-left text-sm leading-7 sm:px-8 lg:px-12">
          <p className="text-base font-semibold">
            Đại học Quốc gia Hà Nội - Trường Đại học Ngoại ngữ
          </p>
          <p>Địa chỉ: Số 2 đường Phạm Văn Đồng, Phường Cầu Giấy, Hà Nội</p>
          <p>Tel: (+84)0866877379</p>
          <p>Email: happydeel5706@gmail.com</p>
          <div className="mt-4 border-t border-white/30 pt-4 text-sm">
            © Trường Đại học Ngoại ngữ - Đại học Quốc gia Hà Nội
          </div>
        </div>
      </footer>
    </div>
  );
}
