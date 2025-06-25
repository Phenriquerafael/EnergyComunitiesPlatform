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
import { IBatteryDTO } from "../../interfaces";
import { BatteryTableBody } from "../../components/batteries/batteryTableBody";
import { message } from "antd"; // Importe o message do Ant Design

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
        onSuccess: () => {
          message.success("Battery deleted successfully!"); // Mensagem de sucesso
          refetch(); // Recarrega a lista após sucesso
        },
        onError: (error) => {
          message.error(
            `Failed to delete battery: ${error.message || "Unknown error"}`
          ); // Mensagem de erro
        },
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
    <div className="page-container bg-base-200 ">
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

      <div className="overflow-x-auto bg-base-200 border rounded-t-lg">
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

      <BatteryTableBody
        filtered={filtered.filter((b): b is IBatteryDTO & { id: string | number } => typeof b.id === "string" || typeof b.id === "number")}
        edit={edit}
        show={show}
        handleDelete={handleDelete}
      />

      {filtered.length === 0 && (
        <div className="text-center mt-4 text-gray-500">No batteries found.</div>
      )}
    </div>
  );
};