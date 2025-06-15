import { useMenu } from "@refinedev/core";
import { NavLink } from "react-router";

interface MenuProps {
  vertical?: boolean;
}

export const Menu: React.FC<MenuProps> = ({ vertical = false }) => {
  const { menuItems } = useMenu();

  return (
    <div className={vertical ? "flex flex-col" : " flex flex-col"}>
      <nav className="sticky top-0 z-50 menu">
        <ul className={`gap-5 justify-start flex ${vertical ? "flex-col" : "flex-row  items-center"}`}>
          {menuItems.map((item) => (
            <li key={item?.key}>
              <NavLink
                to={item?.route ?? "/"}
                className="text-lg flex items-center text-base-content"
              >
                <span className="mr-2">{item?.icon}</span>
                {item?.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
