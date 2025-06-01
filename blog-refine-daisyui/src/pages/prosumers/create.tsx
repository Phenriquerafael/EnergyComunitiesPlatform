import React, { useState } from "react";
import { useList, useNavigation, useCreate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { IBatteryDTO, IUserDTO, ICommunityDTO, IProsumerDTO } from "../../interfaces";
import { message } from "antd";

export const ProsumerCreate = () => {
  const { list } = useNavigation();

  const { mutate: create } = useCreate();

  const {
    data: batteryDataResponse,
    isLoading: isBatteriesLoading,
  } = useList<IBatteryDTO>({
    resource: "batteries/all",
    pagination: { mode: "off" },
  });

  const {
    data: userDataResponse,
    isLoading: isUsersLoading,
  } = useList<IUserDTO>({
    resource: "users/unlinked-users",
    pagination: { mode: "off" },
  });

  const {
    data: communityDataResponse,
    isLoading: isCommunitiesLoading,
  } = useList<ICommunityDTO>({
    resource: "communities/all",
    pagination: { mode: "off" },
  });

  const batteries = batteryDataResponse?.data ?? [];
  const users = userDataResponse?.data ?? [];
  const communities = communityDataResponse?.data ?? [];

  const [selectedBatteryId, setSelectedBatteryId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleProsumerCreate = () => {
    if (!selectedBatteryId || !selectedUserId) {
      alert("Battery and User are required.");
      return;
    }

    const battery = batteries.find((b) => b.id === selectedBatteryId);
    const user = users.find((u) => u.id === selectedUserId);
    const community = communities.find((c) => c.id === selectedCommunityId);


    create(
      {
        resource: "prosumers",
        values: {
          batteryId: selectedBatteryId,
          userId: selectedUserId,
          communityId: selectedCommunityId || undefined,
        },
      },
      {
        onSuccess: () => {
          message.success("Prosumer created successfully!");
          list("prosumers");

        },
        onError: () => {
          alert("Erro ao criar prosumer.");
        },
      }
    );
  };

  return (
    <div className="page-container">
      <div className="flex justify-start items-center">
        <button
          className="mr-2 btn btn-primary btn-sm btn-ghost"
          onClick={() => list("prosumers")}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <h1 className="page-title">Create a Prosumer</h1>
      </div>

      <form className="mx-2" onSubmit={handleSubmit(handleProsumerCreate)}>
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

        {/* Community Selection (Optional) */}
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
            value="Save"
          />
        </div>
      </form>
    </div>
  );
};
