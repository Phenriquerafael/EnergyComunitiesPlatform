import React, { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import {
  useList,
  useNavigation,
  useDelete,
  BaseKey,
} from "@refinedev/core";
import { IProsumerDataDTO } from "../../interfaces";
import ProsumerTableBody from "../../components/prosumers/prosumerTableBody";


export const ProsumerList = () => {
  const { data, refetch } = useList<IProsumerDataDTO>({
    resource: "prosumers/all2",
  });

  const { create } = useNavigation();
  const { mutate: deleteOne } = useDelete();

  const filterForm: any = useRef(null);

  const prosumers = data?.data ?? [];
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<IProsumerDataDTO[]>(prosumers);

  useEffect(() => {
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

      {/* 🔽 Tabela extraída para componente */}
      <ProsumerTableBody
        prosumers={filtered}
        handleDelete={handleDelete}
      />

      {filtered.length === 0 && (
        <div className="text-center mt-4 text-gray-500">No Prosumers found.</div>
      )}
    </div>
  );
};
