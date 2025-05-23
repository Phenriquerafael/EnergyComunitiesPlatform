import React from "react";
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { updateBattery } from "../../services/batteryService";
import IBatteryDTO from "../../interfaces";

export const BatteryEdit = () => {
  const { list } = useNavigation();

  const {
    refineCore: { onFinish, query: queryResult },
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IBatteryDTO>();

  const handleBatteryUpdate = async (data: IBatteryDTO) => {
    try {
      await updateBattery(data); // data inclui o id
      list("batteries");
    } catch (error) {
      console.error("Erro ao atualizar bateria:", error);
    }
  };

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
          onClick={() => queryResult?.refetch()}
        >
          <ArrowPathIcon className="h-5 w-5" />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit(handleBatteryUpdate)} className="mt-6">
        {/* Hidden ID field */}
        <input type="hidden" {...register("id")} />

        {([
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Efficiency (%)", key: "efficiency" },
          { label: "Max Capacity (kWh)", key: "maxCapacity" },
          { label: "Initial Capacity (kWh)", key: "initialCapacity" },
          { label: "Max Charge/Discharge (kW)", key: "maxChargeDischarge" },
        ] as { label: string; key: keyof IBatteryDTO }[]).map(({ label, key }) => (
          <div className="form-control my-4" key={key}>
            <label className="label">{label}</label>
            <input
              className="input input-sm input-bordered"
              type="text"
              {...register(key, {
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
            value="Save"
          />
        </div>
      </form>
    </div>
  );
};
