import React, { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
    PencilSquareIcon,
    EyeIcon,
    TrashIcon,
    BarsArrowDownIcon,
    BarsArrowUpIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { ISimulationDTO, IActiveAtributesDTO } from "../../../interfaces";

interface SimulationTableBodyProps {
    filtered: ISimulationDTO[];
    edit: (resource: string, id: string | number) => void;
    show: (resource: string, id: string | number) => void;
    handleDelete: (id: string | number) => void;
}

export const SimulationTableBody: React.FC<SimulationTableBodyProps> = ({
    filtered,
    edit,
    show,
    handleDelete,
}) => {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const columns = useMemo<ColumnDef<ISimulationDTO>[]>(() => [
        {
            id: "startDate",
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
        },
        {
            id: "endDate",
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
        },
        {
            id: "description",
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "activeAttributes",
            accessorKey: "activeAttributes",
            header: "Active Attributes",
            cell: ({ row, getValue }) => {
                const id = row.original.id as string;
                const isOpen = expandedRows[id] ?? false;
                const attributes = getValue() as IActiveAtributesDTO[] | undefined;

                if (!attributes?.length) {
                    return <span className="text-xs italic text-gray-400">No prosumers</span>;
                }

                return (
                    <div className="text-xs text-left">
                        <button
                            className="btn btn-xs btn-outline mb-1"
                            onClick={() => toggleExpand(id)}
                        >
                            {isOpen ? (
                                <>
                                    <ChevronUpIcon className="w-4 h-4" /> Hide
                                </>
                            ) : (
                                <>
                                    <ChevronDownIcon className="w-4 h-4" /> Show
                                </>
                            )}
                        </button>

                        {isOpen && (
                            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto mt-1">
                                {attributes.map((attr, i) => (
                                    <div key={i} className="border rounded bg-slate-100 p-2">
                                        <div><strong>ID:</strong> {attr.prosumerId}</div>
                                        <div><strong>Profile:</strong> {attr.profileLoad ? "✔️" : "❌"}</div>
                                        <div><strong>SOC:</strong> {attr.stateOfCharge ? "✔️" : "❌"}</div>
                                        <div><strong>PV:</strong> {attr.photovoltaicEnergyLoad ? "✔️" : "❌"}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center items-center gap-2">
                    <button
                        className="btn btn-xs btn-circle btn-ghost"
                        onClick={() => edit("simulations", row.original.id!)}
                    >
                        <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                        className="btn btn-xs btn-circle btn-ghost"
                        onClick={() => show("simulations", row.original.id!)}
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
    ], [edit, show, handleDelete, expandedRows]);

    const {
        getHeaderGroups,
        getRowModel,
    } = useTable({
        data: filtered,
        columns,
    });

    return (
        <div className="w-full mx-auto">
            <div className="overflow-x-auto bg-slate-50 border-t">
                <table className="table table-zebra">
                    <thead className="bg-slate-200">
                        {getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="hover:bg-slate-300 text-center cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex justify-center items-center gap-1">
                                            {!header.isPlaceholder &&
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            {header.column.getIsSorted() === "asc" && (
                                                <BarsArrowUpIcon className="h-4 w-4" />
                                            )}
                                            {header.column.getIsSorted() === "desc" && (
                                                <BarsArrowDownIcon className="h-4 w-4" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="text-center align-top">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
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

export default SimulationTableBody;
