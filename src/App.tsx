import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { GioiThieuPage } from "./pages/GioiThieuPage";
import { HomePage } from "./pages/HomePage";
import { LandlordProfilePage } from "./pages/LandlordProfilePage";
import { RoomDetailPage } from "./pages/RoomDetailPage";
import { LanguageProvider } from "./i18n/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="gioi-thieu" element={<GioiThieuPage />} />
            <Route path="room/:roomId" element={<RoomDetailPage />} />
            <Route path="landlord/:landlordId" element={<LandlordProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
