import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import { UserDrawer } from "../user/UserDrawer";
import { useGetIdentity } from "@refinedev/core";
import { Button } from "antd";
import { useNavigation } from "@refinedev/core";
import Footer from "./footer";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: user } = useGetIdentity();
  const { push } = useNavigation();

  return (
    <>
      <div className="flex flex-col min-h-screen bg-base-100">
        {/* Navbar */}
        <header className="navbar bg-base-200 shadow px-4 text-base-content">
          {/* Menu de navegação */}
          <div className="flex-1">
            <Menu />
          </div>

          {/* Ações do usuário */}
          <div className="flex-none">
            {user ? (
              <UserDrawer />
            ) : (
              <Button type="primary" onClick={() => push("/login")}>
                Login
              </Button>
            )}
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="p-4 bg-base-100 flex-1 text-base-content">
          <Breadcrumb />
          <div>{children}</div>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};