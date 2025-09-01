import React, { useEffect, useState } from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { roleService } from "../../services/roleService";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { UserEdit } from "./edit";

export const UserDrawer: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading } = useGetIdentity<{
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    avatar?: string;
  }>();

  const [roleData, setRoleData] = useState<{ name?: string }>({});
  const [theme, setTheme] = useState<string>(() => {
    // Initialize theme from localStorage or default to 'light'
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    // Fetch role data
    const fetchRole = async () => {
      if (user?.role) {
        const fetchedRoleData = await roleService.getById(user.role);
        setRoleData({ name: fetchedRoleData.name });
      }
    };
    fetchRole();
  }, [user]);

  useEffect(() => {
    // Apply theme to <html> element and save to localStorage
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const { mutate: logout } = useLogout();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Upload logic here:", file);
      // Integrate with AWS S3 or backend
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
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-6 space-y-4">
          {isLoading ? (
            <span className="loading loading-spinner loading-md mx-auto" />
          ) : (
            <>
              {/* Avatar + Name + Email */}
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
                <h2 className="text-lg font-semibold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-zinc-600">{user?.email}</p>
                {user?.role && <p className="text-xs text-zinc-500">{roleData.name}</p>}
              </div>

              <div className="divider">Menu</div>
              {isEditing && <UserEdit onClose={() => setIsEditing(false)} />}

              <ul className="menu space-y-2">
                <li><a onClick={() => setIsEditing(true)}>Edit profile</a></li>
                <li><a>Settings</a></li>
                <li>
                  <a onClick={toggleTheme}>
                    Toggle theme
                    <span className="badge badge-outline ml-2">
                      {theme === "dark" ? "☀️" : "🌙"}
                    </span>
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