import React, { useState } from "react";
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { createBattery, createBatteries, createBatteriesFromExcel } from "../../services/batteryService";
import IBatteryDTO from "../../interfaces";

export const BatteryCreate = () => {
  const { list } = useNavigation();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [excelStatus, setExcelStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<IBatteryDTO[] | null>(null);

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

  const handleBatteryCreate = async (data: any) => {
    try {
      await createBattery(data);
      list("batteries");
    } catch (error) {
      console.error("Erro ao criar bateria:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadStatus(null);
    setExcelStatus(null);
    setPreview(null);

    const isJson = selectedFile.name.endsWith(".json");
    const isExcel = selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls");

    if (isJson) {
      try {
        const text = await selectedFile.text();
        const parsed: IBatteryDTO[] = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error("Conteúdo inválido no ficheiro JSON.");
        setPreview(parsed);
      } catch (error) {
        console.error("Erro ao ler JSON:", error);
        setUploadStatus("Erro ao processar ficheiro JSON.");
      }
    } else if (!isExcel) {
      setUploadStatus("Formato de ficheiro não suportado.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const parsed: IBatteryDTO[] = JSON.parse(text);
      await createBatteries(parsed);
      setUploadStatus("JSON upload successful.");
      list("batteries");
    } catch (error: any) {
      console.error(error);
      setUploadStatus("Upload failed: " + error.message);
    }
  };

  const handleExcelUpload = async () => {
    if (!file) {
      setExcelStatus("Nenhum ficheiro Excel selecionado.");
      return;
    }

    try {
      await createBatteriesFromExcel(file);
      setExcelStatus("Excel upload successful.");
      list("batteries");
    } catch (error: any) {
      console.error(error);
      setExcelStatus("Excel upload failed: " + error.message);
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
        <h1 className="page-title">Create a Battery</h1>
      </div>

      {/* Formulário manual */}
      <form className="mx-2" onSubmit={handleSubmit(handleBatteryCreate)}>
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

        <div className="flex justify-end items-center my-6">
          <input
            className="btn btn-primary btn-sm normal-case text-xl text-zinc-50 font-normal"
            type="submit"
            value="Save"
          />
        </div>
      </form>

      {/* Upload de ficheiro */}
      <div className="border-t mt-8 pt-6">
        <h2 className="text-lg font-semibold mb-5">Upload Battery List</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="input"
          accept=".json,.xlsx,.xls"
        />
        <div className="mt-3 flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={handleUpload}>
            Upload JSON File
          </button>
          <button className="btn btn-sm btn-accent" onClick={handleExcelUpload}>
            Upload Excel File
          </button>
        </div>

        {/* Mensagens */}
        {uploadStatus && (
          <div className={`mt-2 ${uploadStatus.includes("failed") || uploadStatus.includes("Erro") ? "text-red-500" : "text-green-600"}`}>
            {uploadStatus}
          </div>
        )}
        {excelStatus && (
          <div className={`mt-2 ${excelStatus.includes("failed") || excelStatus.includes("Erro") ? "text-red-500" : "text-green-600"}`}>
            {excelStatus}
          </div>
        )}

        {/* Preview JSON */}
        {preview && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Pré-visualização:</h3>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {preview.map((bat, idx) => (
                <li key={idx}>
                  <strong>{bat.name}</strong> - {bat.description} | {bat.maxCapacity} kWh
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
