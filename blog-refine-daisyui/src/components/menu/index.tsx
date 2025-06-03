import { useMenu } from "@refinedev/core";
import { NavLink } from "react-router";

export const Menu = () => {
  const { menuItems } = useMenu();

  return (
    <div className="ml-5 flex flex-col">
      <img
        src="SATCOMM-650x500.png"
        alt="Satcomm Logo"
        className="w-64 h-full mt-5"
      />
      <nav className="items-center justify-center sticky top-0 z-50 menu mx-0 bg-base-200">
        <ul className="mx-0 flex justify-start items-center">
          {menuItems.map((item) => (
            <li key={item?.key} className="mx-0 flex justify-start items-center">
              <div className="text-base-content">
                <NavLink
                  className="text-lg flex items-center text-base-content"
                  to={item?.route ?? "/"}
                >
                  <span className="mr-2">{item?.icon}</span>
                  {item?.label}
                </NavLink>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};