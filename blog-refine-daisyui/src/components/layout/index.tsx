import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import { UserDrawer } from "../user/UserDrawer";
import { useGetIdentity } from "@refinedev/core";
import { Button } from "antd";
import { useNavigation } from "@refinedev/core";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: user } = useGetIdentity();
  const { push } = useNavigation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="navbar bg-base-100 shadow px-4">
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
      <main className="p-4 bg-zinc-100 flex-1">
        <Breadcrumb />
        <div>{children}</div>
      </main>
    </div>
  );
};
