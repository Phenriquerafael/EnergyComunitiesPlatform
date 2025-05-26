import React from "react";
import { useNavigation, useOne, useResource } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router-dom";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import {IBatteryDTO} from "../../interfaces";

export const BatteryShow = () => {
  const { edit, list } = useNavigation();
  const { id } = useResource(); // obtém o id da rota/refine

  const { data, refetch, isLoading} = useOne<IBatteryDTO>({
    resource: "batteries/id",
    id,
  });

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

  return (
    <div className="page-container">
      <div className="page-header">
      <div className="flex justify-between items-center">
        <button
        className="mr-2 btn btn-primary btn-sm btn-ghost"
        onClick={() => list("batteries")}
        >
        <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="page-title">Battery Details</h1>
      </div>
      <div className="flex justify-start items-center mt-4">
        <button
        className="flex justify-center items-center btn btn-primary btn-sm text-zinc-50 normal-case font-normal"
        onClick={() => edit("batteries", data?.data?.id ?? "")}
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
          { label: "ID", key: "id" },
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Efficiency", key: "efficiency" },
          { label: "Max Capacity", key: "maxCapacity" },
          { label: "Initial Capacity", key: "initialCapacity" },
          { label: "Max Charge/Discharge", key: "maxChargeDischarge" },
        ].map(({ label, key }) => (
          <div key={key} className="mb-2">
          <h5 className="text-xl font-bold">{label}</h5>
          <div>{data.data[key as keyof IBatteryDTO] ?? "N/A"}</div>
          </div>
        ))
        ) : (
        <div>Bateria não encontrada.</div>
        )}
      </div>
      </div>
    </div>
  );
};

/* import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import { Edit } from "@refinedev/antd";
import { Form, Input } from "antd";
import IBatteryDTO from "../../interfaces";

export const BatteryEdit = () => {
  const {
    saveButtonProps,
    register,
    handleSubmit,
  } = useForm<IBatteryDTO>({});

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form layout="vertical" onFinish={handleSubmit(() => saveButtonProps.onClick?.({}))}>
        <Form.Item hidden>
          <Input {...register("id")} />
        </Form.Item>
        {["name", "description", "efficiency", "maxCapacity", "initialCapacity", "maxChargeDischarge"].map((field) => (
          <Form.Item key={field} label={field} name={field} rules={[{ required: true }]}>
            <Input {...register(field as keyof IBatteryDTO)} />
          </Form.Item>
        ))}
      </Form>
    </Edit>
  );
};
 */