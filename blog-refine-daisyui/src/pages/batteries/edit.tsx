import React from "react";
import { useNavigation, useResource, useOne, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import {IBatteryDTO} from "../../interfaces";
import { message } from "antd";

export const BatteryEdit = () => {
  const { list } = useNavigation();
  const { id } = useResource(); // obtém o id da rota/refine
  const { data, refetch, isLoading } = useOne<IBatteryDTO>({
    resource: "batteries/id",
    id,
  });

  const { mutate: update, isLoading: isUpdating } = useUpdate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IBatteryDTO>({
    defaultValues: data?.data,
  });

  React.useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

const handleBatteryUpdate = async (formData: IBatteryDTO) => {
  if (!id) {
    console.error("ID is undefined!");
    return;
  }

  update(
    {
      resource: "batteries",
      id, // <-- NECESSÁRIO PARA O useUpdate funcionar
      values: formData, // O body enviado será só este
    },
    {
      onSuccess: () => {
        message.success("Battery updated successfully!");
        list("batteries")

      },
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
            onClick={() => list("batteries")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="page-title">Edit Battery</h1>
        </div>
        <button
          className="flex items-center btn btn-sm btn-primary btn-outline gap-2"
          onClick={() => refetch()}
        >
          <ArrowPathIcon className="h-5 w-5" />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit(handleBatteryUpdate)} className="mt-6">
        <input type="hidden" {...register("id")} />

        {([
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Efficiency (%)", key: "efficiency" },
          { label: "Max Capacity (kWh)", key: "maxCapacity" },
          { label: "Initial Capacity (kWh)", key: "initialCapacity" },
          { label: "Max Charge/Discharge (kW)", key: "maxChargeDischarge" },
        ] as { label: string; key: keyof IBatteryDTO }[]).map(({ label, key }) => (
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