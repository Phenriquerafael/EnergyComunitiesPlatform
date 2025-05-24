import React from "react";
import { useGetIdentity } from "@refinedev/core";
// Simple Skeleton placeholder if shadcn/ui is not installed
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} bg-gray-300 animate-pulse`} />
);

export const UserSider: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<{ 
    name: string; 
    email: string; 
    role?: string; 
    avatar?: string; 
  }>();

  if (isLoading) {
    return (
      <aside className="w-64 bg-zinc-200 p-4">
        <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-zinc-200 p-4">
      <div className="text-center">
        <img
          src={user?.avatar ?? "/default-avatar.png"}
          alt="User avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-lg font-semibold">{user?.name ?? "User"}</h2>
        <p className="text-sm text-zinc-600">{user?.email}</p>
        {user?.role && <p className="text-xs text-zinc-500 mt-1">{user.role}</p>}
      </div>
    </aside>
  );
};
