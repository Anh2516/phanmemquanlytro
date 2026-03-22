import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { GioiThieuPage } from "./pages/GioiThieuPage";
import { HomePage } from "./pages/HomePage";
import { RoomDetailPage } from "./pages/RoomDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="gioi-thieu" element={<GioiThieuPage />} />
          <Route path="room/:roomId" element={<RoomDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
