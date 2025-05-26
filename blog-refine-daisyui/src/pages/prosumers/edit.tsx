import React from "react";
import { useNavigation, useResource, useOne, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { IProsumerDTO,IProsumerDataDTO } from "../../interfaces";

export const ProsumerEdit = () => {
  const { list } = useNavigation();
  const { id } = useResource(); // obtém o id da rota/refine
  const { data, refetch, isLoading } = useOne<IProsumerDataDTO>({
    resource: "prosumers/id",
    id,
  });

  const { mutate: update, isLoading: isUpdating } = useUpdate();

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

const handleProsumerUpdate = async (formData: IProsumerDataDTO) => {
  if (!id) {
    console.error("ID is undefined!");
    return;
  }

  update(
    {
      resource: "prosumers",
      id, // <-- NECESSÁRIO PARA O useUpdate funcionar
      values: formData, // O body enviado será só este
    },
    {
      onSuccess: () => list("prosumers"),
      onError: (error) => console.error("Erro no update:", error),
    }
  );
};


  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            className="mr-2 btn btn-primary btn-sm btn-ghost"
            onClick={() => list("prosumers")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="page-title">Edit Prosumer</h1>
        </div>
        <button
          className="flex items-center btn btn-sm btn-primary btn-outline gap-2"
          onClick={() => refetch()}
        >
          <ArrowPathIcon className="h-5 w-5" />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit(handleProsumerUpdate)} className="mt-6">
        <input type="hidden" {...register("id")} />

        {([
          { label: "Battery Name", key: "batteryName" },
          { label: "User Name", key: "userName" },
          /* { label: "Community Name", key: "communityName" }, */
        ] as { label: string; key: keyof IProsumerDataDTO }[]).map(({ label, key }) => (
          <div className="form-control my-4" key={String(key)}>
            <label className="label">{label}</label>
            <input
              className="input input-sm input-bordered"
              type="text"
              {...register(key as string, {
                required: `The field "${label}" is required`,
              })}
            />
            <span className="text-red-600 text-sm">
              {(errors as any)?.[key]?.message as string}
            </span>
          </div>
        ))}

        <div className="flex justify-end mt-6">
          <input
            className="btn btn-primary btn-sm normal-case text-xl text-zinc-50 font-normal"
            type="submit"
            value={isUpdating ? "Saving..." : "Save"}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};