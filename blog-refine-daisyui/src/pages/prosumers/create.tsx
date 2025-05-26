import React, { useState } from "react";
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
/* import { createProsumer, createBatteries, createBatteriesFromExcel } from "../../services/batteryService"; */
import  { IProsumerDataDTO } from "../../interfaces";

export const ProsumerCreate = () => {
  const { list } = useNavigation();


  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      efficiency: "",
      maxCapacity: "",
      initialCapacity: "",
      maxChargeDischarge: "",
    },
  });

  const handleProsumerCreate = async (data: any) => {
    try {
     /*  await createProsumer(data); */
      list("prosumers/all2");
    } catch (error) {
      console.error("Erro ao criar bateria:", error);
    }
  };



  return (
    <div className="page-container">
      <div className="flex justify-start items-center">
        <button
          className="mr-2 btn btn-primary btn-sm btn-ghost"
          onClick={() => list("batteries")}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <h1 className="page-title">Create a Prosumer</h1>
      </div>

      {/* Formulário manual */}
      <form className="mx-2" onSubmit={handleSubmit(handleProsumerCreate)}>
        {([
          { label: "Battery Name", key: "batteryName" },
          { label: "User Name", key: "userName" },
          { label: "Community Name", key: "communityName" },
        ] as { label: string; key: keyof IProsumerDataDTO }[]).map(({ label, key }) => (
          <div className="form-control my-4" key={key}>
            <label className="label">{label}</label>
            <input
              className="input input-sm input-bordered"
              type="text"
          {...register(
            key as
              | "name"
              | "description"
              | "efficiency"
              | "maxCapacity"
              | "initialCapacity"
              | "maxChargeDischarge",
            {
              required: `The field "${label}" is required`,
            }
          )}
            />
            <span className="text-red-600 text-sm">
              {(errors as any)?.[key]?.message as string}
            </span>
          </div>
        ))}

        <div className="flex justify-end items-center my-6">
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
