import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import SharedWishlistPage from "@/pages/SharedWishlistPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/wishlist/:id" element={<SharedWishlistPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

