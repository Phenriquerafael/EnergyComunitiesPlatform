// components/prosumer/ProsumerTableBody.tsx

import React from "react";
import {
  PencilSquareIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { IProsumerDataDTO } from "../../interfaces";
import {
  useList,
  useNavigation,
  useDelete,
  BaseKey,
} from "@refinedev/core";

interface Props {
  prosumers: IProsumerDataDTO[];
  handleDelete?: (id: BaseKey) => void;
}




const ProsumerTableBody: React.FC<Props> = ({ prosumers, handleDelete}) => {
  const { edit, show } = useNavigation();

  return (
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
        {prosumers.map((prosumer) => (
          <tr key={prosumer.id}>
            <td className="text-center">{prosumer.id}</td>
            <td className="text-center">{prosumer.userName}</td>
            <td className="text-center">{prosumer.email}</td>
            <td className="text-center">
              {prosumer.communityName ?? "none"}
            </td>
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
                {handleDelete && <button
                  className="btn btn-xs btn-circle btn-ghost"
                  onClick={() => handleDelete(prosumer.id!)}
                >
                  <TrashIcon className="h-4 w-4 text-error" />
                </button>}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProsumerTableBody;
