// src/components/AuthFallback.tsx
import { useLocation } from "react-router-dom";
import { Register } from "./Register";
import { ChangePassword } from "./ChangePassword";
import { Login } from "./Login";


export const AuthFallback: React.FC = () => {
  const { pathname } = useLocation();

  switch (pathname) {
    case "/register":
      return <Register />;
    case "/change-password":
      return <ChangePassword />;
    default:
      return <Login />;
  }
};