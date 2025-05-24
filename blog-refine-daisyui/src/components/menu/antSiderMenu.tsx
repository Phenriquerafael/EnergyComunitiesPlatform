import React from "react";
import { useMenu } from "@refinedev/core";
import { Menu, MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "antd";

const { Sider } = Layout;

export const AntSiderMenu: React.FC = () => {
  const { menuItems } = useMenu();
  const navigate = useNavigate();
  const location = useLocation();

  // Converte os menuItems do Refine no formato do Ant Design
  const items: MenuProps["items"] = menuItems.map((item) => ({
    key: item.route ?? "/",
    icon: item.icon ? <span>{item.icon}</span> : null,
    label: item.label,
  }));

  return (
    <Sider width={220} className="site-layout-background">
      <div className="p-4 text-center">
        <img src="/SATCOMM-650x500.png" alt="Satcomm Logo" className="w-40 mx-auto mb-4" />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: "100%", borderRight: 0 }}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};
