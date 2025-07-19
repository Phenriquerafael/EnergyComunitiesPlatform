import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import { UserDrawer } from "../user/UserDrawer";
import { useGetIdentity } from "@refinedev/core";
import { Button } from "antd";
import { useNavigation } from "@refinedev/core";
import Footer from "./footer";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: user, isLoading } = useGetIdentity();
  const { push } = useNavigation();

/*   useEffect(() => {
    if (!isLoading && !user) {
      push("/login");
    }
  }, [user, isLoading, push]); */

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* Logo acima da navbar */}
      <div className="flex xs:justify-center bg-base-200">
        <img
          src="SATCOMM-650x500.png"
          alt="Satcomm Logo"
          className="w-64 h-full mt-5"
        />
      </div>

      {/* Navbar */}
      <header className="navbar bg-base-200 shadow px-4 text-base-content">
        {/* Mobile Dropdown Menu */}
        <div className="flex-1 sm:hidden">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>

            <div
              tabIndex={0}
              className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64"
            >
              <Menu vertical />
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="flex-1 hidden sm:block">
          <Menu />
        </div>

        {/* User Actions */}
        <div className="">
          {user ? (
            <UserDrawer />
          ) : (
            <Button type="primary" onClick={() => push("/login")}>
              Login
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4  flex-1 text-base-content">
        <Breadcrumb />
        <div>{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
