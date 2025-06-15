import React, { useMemo, useRef } from "react";
import { getDefaultFilter } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import {
    PencilSquareIcon,
    EyeIcon,
    TrashIcon,
    FunnelIcon,
    BarsArrowDownIcon,
    BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import { IBatteryDTO } from "../../interfaces";

interface BatteryTableBodyProps {
    filtered: IBatteryDTO[];
    edit: (resource: string, id: string | number) => void;
    show: (resource: string, id: string | number) => void;
    handleDelete: (id: string | number) => void;
}

export const BatteryTableBody: React.FC<BatteryTableBodyProps> = ({
    filtered,
    edit,
    show,
    handleDelete,
}) => {
    const filterForm = useRef<HTMLFormElement>(null);

    const columns = useMemo<ColumnDef<IBatteryDTO>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                header: "Name",
            },
            {
                id: "description",
                accessorKey: "description",
                header: "Description",
            },
            {
                id: "efficiency",
                accessorKey: "efficiency",
                header: "Efficiency (%)",
            },
            {
                id: "maxCapacity",
                accessorKey: "maxCapacity",
                header: "Max Capacity (kWh)",
            },
            {
                id: "initialCapacity",
                accessorKey: "initialCapacity",
                header: "Initial Capacity (kWh)",
            },
            {
                id: "maxChargeDischarge",
                accessorKey: "maxChargeDischarge",
                header: "Max Charge/Discharge (kW)",
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            className="btn btn-xs btn-circle btn-ghost"
                            onClick={() => edit("batteries", row.original.id!)}
                        >
                            <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                            className="btn btn-xs btn-circle btn-ghost"
                            onClick={() => show("batteries", row.original.id!)}
                        >
                            <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                            className="btn btn-xs btn-circle btn-ghost"
                            onClick={() => handleDelete(row.original.id!)}
                        >
                            <TrashIcon className="h-4 w-4 text-error" />
                        </button>
                    </div>
                ),
            },
        ],
        [edit, show, handleDelete]
    );

    const {
        refineCore: { filters, setCurrent, setFilters },
        getHeaderGroups,
        getRowModel,
    } = useTable({
        data: filtered,
        columns,
        refineCoreProps: {
            resource: "batteries",
            pagination: {
                pageSize: 10,
            },
        },
    });

    const header = (
        <div className="w-full mx-auto">
{/*             <div className="my-2">
                <h1 className="page-title text-gray-700">Batteries</h1>
            </div> */}
{/*             <div className="overflow-x-auto bg-slate-50 border rounded-t-lg">
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
            </div> */}
        </div>
    );

    return (
        <div className="w-full mx-auto ">
            {header}
            <div className="overflow-x-auto bg-slate-50 ">
                <table className="table table-zebra border-t">
                    <thead className="bg-slate-200">
                        {getHeaderGroups()?.map((headerGroup) => (
                            <tr key={headerGroup?.id}>
                                {headerGroup?.headers?.map((header) => (
                                    <th
                                        className="hover:bg-slate-300 text-center"
                                        key={header?.id}
                                        onClick={header?.column?.getToggleSortingHandler()}
                                    >
                                        <div className="flex justify-center items-center">
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
                                    <td className="text-center" key={cell?.id}>
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

export default BatteryTableBody;