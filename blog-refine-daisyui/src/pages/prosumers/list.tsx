import React, { useState, useRef } from "react";
import {
  PlusIcon,
  FunnelIcon,
  PencilSquareIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  useList,
  useNavigation,
  useDelete,
  BaseKey,
} from "@refinedev/core";
import {IProsumerDataDTO} from "../../interfaces";

export const ProsumerList = () => {
  const { data, refetch } = useList<IProsumerDataDTO>({
    resource: "prosumers/all2",
  });

  const { edit, show, create } = useNavigation();
  const { mutate: deleteOne } = useDelete();

  const filterForm: any = useRef(null);

  const prosumers = data?.data ?? [];
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<IProsumerDataDTO[]>(prosumers);

  React.useEffect(() => {
    setFiltered(prosumers);
  }, [prosumers]);

  const handleDelete = async (id: BaseKey) => {
    deleteOne(
      {
        resource: "prosumers",
        id,
      },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value) {
      setFiltered(prosumers);
    } else {
      setFiltered(
        prosumers.filter((b) =>
          b.id?.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Prosumers</h1>
        <button
          className="btn btn-sm btn-primary normal-case font-normal text-zinc-50"
          onClick={() => create("prosumers")}
        >
          <PlusIcon className="h-5 w-5" />
          Add Prosumer
        </button>
      </div>

      <div className="overflow-x-auto bg-slate-50 border">
        <div className="flex justify-between items-center m-4">
          <button
            className="btn btn-outline btn-primary btn-sm normal-case font-light"
            onClick={() => {
              setSearch("");
              filterForm?.current?.reset();
              setFiltered(prosumers);
            }}
          >
            <FunnelIcon className="h-4 w-4" />
            Clear
          </button>
          <form ref={filterForm}>
            <input
              className="input input-bordered input-sm"
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name..."
            />
          </form>
        </div>
      </div>

      <table className="table table-zebra border-t">
        <thead className="bg-slate-200">
          <tr>
        <th className="text-center">ID</th>
        <th className="text-center">User Name</th>
        <th className="text-center">Email</th>
        <th className="text-center">Community Name</th>
        <th className="text-center">Battery ID</th>
        <th className="text-center">Battery Name</th>
        <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((prosumer) => (
        <tr key={prosumer.id}>
          <td className="text-center">{prosumer.id}</td>
          <td className="text-center">{prosumer.userName}</td>
          <td className="text-center">{prosumer.email}</td>
          <td className="text-center">{prosumer.communityName?prosumer.communityName: "none"}</td>
          <td className="text-center">{prosumer.batteryId}</td>
          <td className="text-center">{prosumer.batteryName}</td>
          <td className="text-center">
            <div className="flex justify-center items-center gap-2">
          <button
            className="btn btn-xs btn-circle btn-ghost"
            onClick={() => edit("prosumers", prosumer.id!)}
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            className="btn btn-xs btn-circle btn-ghost"
            onClick={() => show("prosumers", prosumer.id!)}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            className="btn btn-xs btn-circle btn-ghost"
            onClick={() => handleDelete(prosumer.id!)}
          >
            <TrashIcon className="h-4 w-4 text-error" />
          </button>
            </div>
          </td>
        </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="text-center mt-4 text-gray-500">No Prosumers found.</div>
      )}
    </div>
  );
};
