/* import React, { useMemo, useRef } from "react";
import { getDefaultFilter, useList, useNavigation, useDelete } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  FunnelIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  PlusIcon,
  PencilSquareIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { IProsumerDataDTO } from "../../interfaces";
import ProsumerTableBody from "../../components/prosumers/prosumerTableBody";

const ProsumerTable: React.FC = () => {
  const filterForm = useRef<HTMLFormElement>(null);
  const { create, edit, show } = useNavigation();
  const { mutate: deleteProsumer } = useDelete();
  const { data: prosumerData, refetch } = useList<IProsumerDataDTO>({
    resource: "prosumers/all2",
  });

  const columns = useMemo<ColumnDef<IProsumerDataDTO>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
      },
      {
        id: "userName",
        accessorKey: "userName",
        header: "User Name",
        cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
      },
      {
        id: "communityName",
        accessorKey: "communityName",
        header: "Community Name",
        cell: ({ getValue }) => (
          <div className="text-center">{String(getValue() ?? "none")}</div>
        ),
      },
      {
        id: "batteryId",
        accessorKey: "batteryId",
        header: "Battery ID",
        cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
      },
      {
        id: "batteryName",
        accessorKey: "batteryName",
        header: "Battery Name",
        cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-center items-center gap-2">
            <button
              className="btn btn-xs btn-circle btn-ghost"
              onClick={() => row.original.id !== undefined && edit("prosumers", row.original.id)}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              className="btn btn-xs btn-circle btn-ghost"
              onClick={() => row.original.id !== undefined && show("prosumers", row.original.id)}
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              className="btn btn-xs btn-circle btn-ghost"
              onClick={() => {
                if (row.original.id !== undefined) {
                  deleteProsumer(
                    { resource: "prosumers", id: row.original.id },
                    { onSuccess: () => refetch() }
                  );
                }
              }}
            >
              <TrashIcon className="h-4 w-4 text-error" />
            </button>
          </div>
        ),
      },
    ],
    [edit, show]
  );

  const {
    refineCore: { filters, setCurrent, setFilters },
    getHeaderGroups,
    getRowModel,
  } = useTable({
    columns,
    data: prosumerData?.data ?? [],
    refineCoreProps: {
      resource: "prosumers/all2",
      pagination: {
        pageSize: 10,
      },
    },
  });

  const header = (
    <div className="w-full mx-auto">
      <div className="page-header">
        <h1 className="page-title text-gray-700">Prosumers</h1>
        <button
          className="btn btn-sm btn-primary normal-case font-normal text-zinc-50"
          onClick={() => create("prosumers")}
        >
          <PlusIcon className="h-5 w-5" />
          Add Prosumer
        </button>
      </div>
      <div className="overflow-x-auto bg-slate-50 border rounded-t-lg">
        <div className="flex justify-between items-center m-4">
          <button
            className="btn btn-outline btn-primary btn-sm normal-case font-light"
            onClick={() => {
              setCurrent(1);
              setFilters([], "replace");
              filterForm.current?.reset();
            }}
          >
            <FunnelIcon className="h-4 w-4" />
            Clear
          </button>
          <div className="flex justify-end items-center">
            <form ref={filterForm}>
              <input
                className="input input-bordered input-sm"
                type="search"
                value={getDefaultFilter("q", filters)}
                onChange={(e) => {
                  setCurrent(1);
                  setFilters([
                    {
                      field: "q",
                      value: e.target.value,
                      operator: "contains",
                    },
                  ]);
                }}
                placeholder="Search with keywords"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto my-8 drop-shadow-md">
      {header}
      <div className="p-4 overflow-x-auto bg-slate-50 border rounded-b-lg">
        {getRowModel().rows.length === 0 ? (
          <div className="text-center mt-4 text-gray-500">No Prosumers found.</div>
        ) : (
          <table className="table table-zebra border-t w-full">
            <thead className="bg-slate-200">
              {getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="hover:bg-slate-300"
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex justify-center items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <BarsArrowUpIcon className="h-4 w-4" />,
                          desc: <BarsArrowDownIcon className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <ProsumerTableBody rows={getRowModel().rows} />
          </table>
        )}
      </div>
    </div>
  );
};

export default ProsumerTable; */