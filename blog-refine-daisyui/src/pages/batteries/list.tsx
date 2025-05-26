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
import {IBatteryDTO} from "../../interfaces";

export const BatteryList = () => {
  const { data, refetch } = useList<IBatteryDTO>({
    resource: "batteries/all",
  });

  const { edit, show, create } = useNavigation();
  const { mutate: deleteOne } = useDelete();

  const filterForm: any = useRef(null);

  const batteries = data?.data ?? [];
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<IBatteryDTO[]>(batteries);

  React.useEffect(() => {
    setFiltered(batteries);
  }, [batteries]);

  const handleDelete = async (id: BaseKey) => {
    deleteOne(
      {
        resource: "batteries",
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
      setFiltered(batteries);
    } else {
      setFiltered(
        batteries.filter((b) =>
          b.name?.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Batteries</h1>
        <button
          className="btn btn-sm btn-primary normal-case font-normal text-zinc-50"
          onClick={() => create("batteries")}
        >
          <PlusIcon className="h-5 w-5" />
          Add Battery
        </button>
      </div>

      <div className="overflow-x-auto bg-slate-50 border">
        <div className="flex justify-between items-center m-4">
          <button
            className="btn btn-outline btn-primary btn-sm normal-case font-light"
            onClick={() => {
              setSearch("");
              filterForm?.current?.reset();
              setFiltered(batteries);
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
            <th className="text-center">Name</th>
            <th className="text-center">Description</th>
            <th className="text-center">Efficiency (%)</th>
            <th className="text-center">Max Capacity (kWh)</th>
            <th className="text-center">Initial Capacity (kWh)</th>
            <th className="text-center">Max Charge/Discharge (kW)</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((battery) => (
            <tr key={battery.id}>
              <td className="text-center">{battery.name}</td>
              <td className="text-center">{battery.description}</td>
              <td className="text-center">{battery.efficiency}</td>
              <td className="text-center">{battery.maxCapacity}</td>
              <td className="text-center">{battery.initialCapacity}</td>
              <td className="text-center">{battery.maxChargeDischarge}</td>
              <td className="text-center">
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="btn btn-xs btn-circle btn-ghost"
                    onClick={() => edit("batteries", battery.id!)}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-xs btn-circle btn-ghost"
                    onClick={() => show("batteries", battery.id!)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-xs btn-circle btn-ghost"
                    onClick={() => handleDelete(battery.id!)}
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
        <div className="text-center mt-4 text-gray-500">No batteries found.</div>
      )}
    </div>
  );
};
