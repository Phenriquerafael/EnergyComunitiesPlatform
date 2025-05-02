import { DashboardOutlined, ProjectOutlined, ShopOutlined, ProfileOutlined } from "@ant-design/icons"; // Importe o ícone adequado para "Perfil"
import { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "companies",
    list: "/companies",
    show: "/companies/:id",
    create: "/companies/new",
    edit: "/companies/edit/:id",
    meta: {
      label: "Companies",
      icon: <ShopOutlined />,
    },
  },
  {
    name: "tasks",
    list: "/tasks",
    create: "/tasks/new",
    edit: "/tasks/edit/:id",
    meta: {
      label: "Tasks",
      icon: <ProjectOutlined />,
    },
  },
  {
    name: "profiles",  // Novo recurso para Profile Analytics
    list: "/profiles",  // Definindo a rota para acessar a página de análise de perfis
    meta: {
      label: "Profile Analytics",  // O nome do item no sidebar
      icon: <ProfileOutlined />,  // Ícone do sidebar (você pode usar um ícone apropriado)
    },
  },

  {
    name: "profileUpload",
    list: "/profile-upload",
    create: "/profile-upload/new",
    meta: {
      label: "Profile Upload",
      icon: <ProfileOutlined />,
    },
  }

];
