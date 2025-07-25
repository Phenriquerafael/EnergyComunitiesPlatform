// src/components/PublicRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { ChangePassword } from "./ChangePassword";


export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<Login />} /> {/* Fallback padrão para /login */}
    </Routes>
  );
};