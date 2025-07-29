import { FunctionComponent } from "react";
import { Login } from "../../pages/auth/Login";
import LoginForm from "./loginForm";

interface AuthSectionProps {
  children?: React.ReactNode;
}

const AuthSection: FunctionComponent<AuthSectionProps> = ({ children }) => {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(/auth/1920_solarparkaton.jpg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content w-full flex-col ">
          {/*   <h1 className="text-5xl font-bold text-white">Welcome to Satcomm</h1> */}

          <div className="bg-base-100 rounded-lg shadow-lg p-8 w-full max-w-md">
            <img
              src="SATCOMM-650x500.png"
              alt="Satcomm Logo"
              className="w-64 h-full  justify-center items-center mx-auto mb-10"
            />
            {children || <LoginForm />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthSection;
