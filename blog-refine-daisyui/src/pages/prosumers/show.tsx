import React from "react";
import { useNavigation, useOne, useResource } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router-dom";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import {IProsumerDataDTO} from "../../interfaces";

export const ProsumerShow = () => {
  const { edit, list } = useNavigation();
  const { id } = useResource(); // obtém o id da rota/refine

  const { data, refetch, isLoading} = useOne<IProsumerDataDTO>({
    resource: "prosumers/id",
    id,
  });

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<IProsumerDataDTO>({
      defaultValues: data?.data,
    });

    React.useEffect(() => {
      if (data?.data) {
        reset(data.data);
      }
    }, [data, reset]);

  return (
    <div className="page-container">
      <div className="page-header">
      <div className="flex justify-between items-center">
        <button
        className="mr-2 btn btn-primary btn-sm btn-ghost"
        onClick={() => list("prosumers")}
        >
        <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="page-title">Prosumers Details</h1>
      </div>
      <div className="flex justify-start items-center mt-4">
        <button
        className="flex justify-center items-center btn btn-primary btn-sm text-zinc-50 normal-case font-normal"
        onClick={() => edit("prosumers", data?.data?.id ?? "")}
        disabled={!data?.data}
        >
        <PencilSquareIcon className="h-5 w-5" />
        Edit
        </button>
      </div>
      </div>

      <div className="card mt-4">
      <div className="card-body">
        {isLoading ? (
        <div>Loading...</div>
        ) : data?.data ? (
        [
          { label: "Battery Name", key: "batteryName" },
          { label: "User Name", key: "userName" },
          { label: "Community Name", key: "communityName" },
        ].map(({ label, key }) => (
          <div key={key} className="mb-2">
          <h5 className="text-xl font-bold">{label}</h5>
          <div>{data.data[key as keyof IProsumerDataDTO] ?? "N/A"}</div>
          </div>
        ))
        ) : (
        <div>Prosumer not found.</div>
        )}
      </div>
      </div>
    </div>
  );
};
