import React from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";

export const UserDrawer: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<{
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    avatar?: string;
  }>();

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
        <label htmlFor="user-drawer" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={user?.avatar ?? "/default-avatar.png"} alt="avatar" />
          </div>
        </label>
      </div>

      <div className="drawer-side">
        <label htmlFor="user-drawer" className="drawer-overlay"></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-6 space-y-4">
          {isLoading ? (
            <span className="loading loading-spinner loading-md mx-auto" />
          ) : (
            <>
              {/* Avatar + Nome + Email */}
              <div className="text-center">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <img
                    src={user?.avatar ?? "/default-avatar.png"}
                    alt="User avatar"
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-4 hover:opacity-80 transition"
                  />
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
                {user?.role && <p className="text-xs text-zinc-500">{user.role}</p>}
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
