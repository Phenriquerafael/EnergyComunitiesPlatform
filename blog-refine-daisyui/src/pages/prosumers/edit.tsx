import React, { useState } from "react";
import { useNavigation, useResource, useOne, useUpdate, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { IBatteryDTO, ICommunityDTO, IProsumerDTO, IProsumerDataDTO, IUserDTO } from "../../interfaces";
import { message } from "antd";

export const ProsumerEdit = () => {
  const { list } = useNavigation();
  const { id } = useResource();
  const { data, refetch, isLoading } = useOne<IProsumerDataDTO>({
    resource: "prosumers/id",
    id,
  });

  const { mutate: update, isLoading: isUpdating } = useUpdate();

  const { data: batteryDataResponse } = useList<IBatteryDTO>({
    resource: "batteries/all",
    pagination: { mode: "off" },
  });

  const { data: userDataResponse } = useList<IUserDTO>({
    resource: "users/unlinked-users",
    pagination: { mode: "off" },
  });

  const { data: communityDataResponse } = useList<ICommunityDTO>({
    resource: "communities/all",
    pagination: { mode: "off" },
  });

  const [selectedBatteryId, setSelectedBatteryId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IProsumerDataDTO>({
    defaultValues: data?.data,
  });

  React.useEffect(() => {
    if (data?.data) {
      reset(data.data);
      setSelectedBatteryId(data.data.batteryId ?? "");
      setSelectedUserId(data.data.userId ?? "");
      setSelectedCommunityId(data.data.communityId ?? "");
    }
  }, [data, reset]);

  // Adiciona user atual à lista se não estiver presente
  const users: IUserDTO[] = [
    ...(userDataResponse?.data ?? []),
    ...(data?.data.userId && !userDataResponse?.data?.some(u => u.id === data.data.userId)
      ? [{
          id: data.data.userId,
          firstName: data.data.userName?.split(" ")[0] ?? "",
          lastName: data.data.userName?.split(" ")[1] ?? "",
          email: data.data.email,
          phoneNumber: "", // Provide a default or fetch if available
          password: "",    // Provide a default or fetch if available
          role: "user",    // Provide a sensible default or fetch if available
        } as IUserDTO]
      : [])
  ];

  // Baterias
  const batteries = batteryDataResponse?.data ?? [];

  // Adiciona community atual à lista se não estiver presente
  const communities: ICommunityDTO[] = [
    ...(communityDataResponse?.data ?? []),
    ...(data?.data.communityId && !communityDataResponse?.data?.some(c => c.id === data.data.communityId)
      ? [{
          id: data.data.communityId,
          name: data.data.communityName ?? "Unknown",
        }]
      : [])
  ];

  const handleProsumerUpdate = async (formData: IProsumerDataDTO) => {
    if (!id) {
      console.error("ID is undefined!");
      return;
    }

    const battery = batteries.find((b) => b.id === selectedBatteryId);
    const user = users.find((u) => u.id === selectedUserId);
    const community = communities.find((c) => c.id === selectedCommunityId);

    update(
      {
        resource: "prosumers",
        id,
        values: {
          ...formData,
          batteryId: selectedBatteryId,
          batteryName: battery?.name ?? "",
          userId: selectedUserId,
          userName: user ? `${user.firstName} ${user.lastName}` : "",
          email: user?.email ?? "",
          communityId: selectedCommunityId || undefined,
          communityName: community?.name ?? "",
        },
      },
      {
        onSuccess: () => {
          message.success("Prosumer updated successfully!");
          list("prosumers");
        },
        onError: (error) => console.error("Erro no update:", error),
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            className="mr-2 btn btn-primary btn-sm btn-ghost"
            onClick={() => list("prosumers")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="page-title">Edit Prosumer</h1>
        </div>
        <button
          className="flex items-center btn btn-sm btn-primary btn-outline gap-2"
          onClick={() => refetch()}
        >
          <ArrowPathIcon className="h-5 w-5" />
          Refresh
        </button>
      </div>

      <form className="mx-2 mt-6" onSubmit={handleSubmit(handleProsumerUpdate)}>
        <input type="hidden" {...register("id")} />

        {/* Battery Selection */}
        <div className="form-control my-4">
          <label className="label">Battery *</label>
          <select
            className="select select-bordered select-sm"
            value={selectedBatteryId}
            onChange={(e) => setSelectedBatteryId(e.target.value)}
            required
          >
            <option value="">Select a battery</option>
            {batteries.map((battery) => (
              <option key={battery.id} value={battery.id}>
                {battery.name}
              </option>
            ))}
          </select>
          {!selectedBatteryId && (
            <span className="text-red-600 text-sm">Battery is required</span>
          )}
        </div>

        {/* User Selection */}
        <div className="form-control my-4">
          <label className="label">User *</label>
          <select
            className="select select-bordered select-sm"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
          {!selectedUserId && (
            <span className="text-red-600 text-sm">User is required</span>
          )}
        </div>

        {/* Community Selection */}
        <div className="form-control my-4">
          <label className="label">Community</label>
          <select
            className="select select-bordered select-sm"
            value={selectedCommunityId}
            onChange={(e) => setSelectedCommunityId(e.target.value)}
          >
            <option value="">None</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end items-center my-6">
          <input
            className="btn btn-primary btn-sm normal-case text-xl text-zinc-50 font-normal"
            type="submit"
            value={isUpdating ? "Saving..." : "Save"}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};
