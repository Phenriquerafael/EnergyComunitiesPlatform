import React, { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
    PencilSquareIcon,
    EyeIcon,
    TrashIcon,
    BarsArrowDownIcon,
    BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import { ISimulationDTO } from "../../../interfaces";
import SimulationShow from "./SimulationShow"; // importa o componente expandido

interface SimulationTableBodyProps {
    filtered: ISimulationDTO[];
    edit: (resource: string, id: string | number) => void;
    show: (resource: string, id: string | number) => void; // opcional agora
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
                        onClick={() => toggleExpand(row.original.id!)}
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
    ], [edit, handleDelete]);

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
                            <React.Fragment key={row.id}>
                                <tr>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="text-center align-top">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                {expandedRows[row.original.id!] && (
                                    <tr>
                                        <td colSpan={columns.length}>
                                            <div className="p-4 bg-gray-100 rounded-lg">
                                                <SimulationShow simulation={row.original} />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SimulationTableBody;
