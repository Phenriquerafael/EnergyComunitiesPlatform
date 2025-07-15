import React, { useMemo, useRef } from "react";
import { getDefaultFilter } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import {
  FunnelIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";

type Simulation = {
  startDate: string;
  endDate: string;
  description: string;
  profileLoad: boolean;
  stateOfCharge: boolean;
  photovoltaicEnergyLoad: boolean;
  [key: string]: any;
};

type RecentSimulationsProps = {
  data: Simulation[];
};

export const RecentSimulations: React.FC<RecentSimulationsProps> = ({ data }) => {
  const filterForm: any = useRef(null);

  const columns = useMemo<ColumnDef<Simulation>[]>(
    () => [
      {
        id: "startDate",
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <div>
              {date.toLocaleDateString("en-US")}
            </div>
          );
        },
      },
      {
        id: "endDate",
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <div>
              {date.toLocaleDateString("en-US")}
            </div>
          );
        },
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
      },
      {
        id: "profileLoad",
        accessorKey: "profileLoad",
        header: "Profile Load",
        cell: ({ getValue }) => (
          <span className={`badge badge-${getValue() ? "error" : "success"}`}>
            {getValue() ? "Deactivated" : "Activated"}
          </span>
        ),
      },
      {
        id: "stateOfCharge",
        accessorKey: "stateOfCharge",
        header: "State Of Charge",
        cell: ({ getValue }) => (
          <span className={`badge badge-${getValue() ? "error" : "success"}`}>
            {getValue() ? "Deactivated" : "Activated"}
          </span>
        ),
      },
      {
        id: "photovoltaicEnergyLoad",
        accessorKey: "photovoltaicEnergyLoad",
        header: "Photovoltaic Energy Load",
        cell: ({ getValue }) => (
          <span className={`badge badge-${getValue() ? "error" : "success"}`}>
            {getValue() ? "Deactivated" : "Activated"}
          </span>
        ),
      },

    ],
    [],
  );

  const {
    refineCore: { filters, setCurrent, setFilters },
    getHeaderGroups,
    getRowModel,
  } = useTable({
    data,
    columns,
    refineCoreProps: {
      resource: "simulations",
      pagination: {
        pageSize: 5,
      },
    },
  });

  const header = (
    <div className="w-full mx-auto">
      <div className="my-2">
        <h1 className="page-title text-gray-700">Recent Simulations</h1>
      </div>
      <div className="overflow-x-auto bg-slate-50 border rounded-t-lg">
        <div className="flex justify-between items-center m-4">
          <button
            className="btn btn-outline btn-primary btn-sm normal-case font-light"
            onClick={() => {
              setCurrent(1);
              setFilters([], "replace");
              filterForm?.current?.reset();
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
        <table className="table table-zebra border-t">
          <thead className="bg-slate-200">
            {getHeaderGroups()?.map((headerGroup) => (
              <tr key={headerGroup?.id}>
                {headerGroup?.headers?.map((header) => (
                  <th
                    className="hover:bg-slate-300"
                    key={header?.id}
                    onClick={header?.column?.getToggleSortingHandler()}
                  >
                    <div className="flex justify-start items-center">
                      {!header?.isPlaceholder &&
                        flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext(),
                        )}
                      {{
                        asc: <BarsArrowUpIcon className="h-4 w-4" />,
                        desc: <BarsArrowDownIcon className="h-4 w-4" />,
                      }[header?.column?.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel()?.rows?.map((row) => (
              <tr key={row?.id}>
                {row?.getVisibleCells()?.map((cell) => (
                  <td key={cell?.id}>
                    {flexRender(
                      cell?.column?.columnDef?.cell,
                      cell?.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
