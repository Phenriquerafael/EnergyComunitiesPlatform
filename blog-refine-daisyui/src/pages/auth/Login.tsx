// src/pages/auth/Login.tsx
import React from "react";
import AuthSection from "../../components/auth/authSection";
import LoginForm from "../../components/auth/loginForm";

export const Login: React.FC = () => {


  return (
    <AuthSection children={<LoginForm />} />
  );
};
export default Login;