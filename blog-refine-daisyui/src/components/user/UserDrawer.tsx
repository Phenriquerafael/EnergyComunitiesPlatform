import React from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { roleService } from "../../services/roleService";
import { UserCircleIcon } from "@heroicons/react/20/solid";



export const UserDrawer: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<{
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    avatar?: string;
  }>();

  const [roleData, setRoleData] = React.useState<{ name?: string }>({});

  React.useEffect(() => {
    const fetchRole = async () => {
      if (user?.role) {
        const fetchedRoleData = await roleService.getById(user.role);
        setRoleData({ name: fetchedRoleData.name }); // Atualiza o nome da role
      }
    };
    fetchRole();
  }, [user]);

  const { mutate: logout } = useLogout();

  const toggleTheme = () => {
    const html = document.documentElement;
    html.setAttribute(
      "data-theme",
      html.getAttribute("data-theme") === "dark" ? "light" : "dark"
    );
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Upload logic here:", file);
      // Aqui você pode integrar com AWS S3 ou seu backend
    }
  };

  return (
    <div className="drawer drawer-end z-50">
      <input id="user-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="user-drawer" className="btn btn-ghost btn-circle btn-lg avatar">
        <div className="rounded-full w-20 h-20 flex items-center justify-center">
        {user?.avatar ? (
          <img
          src={user.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <UserCircleIcon className="w-16 h-16 text-base-content" />
        )}
        </div>
        </label>
      </div>

      <div className="drawer-side">
        <label htmlFor="user-drawer" className="drawer-overlay"></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-6 space-y-4 ">
          {isLoading ? (
            <span className="loading loading-spinner loading-md mx-auto" />
          ) : (
            <>
              {/* Avatar + Nome + Email */}
              <div className="text-center mt-5">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-4 hover:opacity-80 transition"
                  />
                  ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserCircleIcon className="w-20 h-20" />
                  </div>
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <h2 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-zinc-600">{user?.email}</p>
                {user?.role && <p className="text-xs text-zinc-500">{roleData.name}</p>}
              </div>

              <div className="divider">Menu</div>
              <ul className="menu space-y-2">
                <li><a>Editar perfil</a></li>
                <li><a>Definições</a></li>
                <li>
                  <a onClick={toggleTheme}>
                    Alternar tema
                    <span className="badge badge-outline ml-2">🌙/☀️</span>
                  </a>
                </li>
              </ul>

              <div className="divider" />
              <button
                className="btn btn-sm btn-error w-full text-white"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
