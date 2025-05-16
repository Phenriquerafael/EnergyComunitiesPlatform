import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col ">

      <Menu />
      <div className="p-4 bg-zinc-100 w-full">
        <Breadcrumb />
        <div>{children}</div>
      </div>
    </div>
  );
};
