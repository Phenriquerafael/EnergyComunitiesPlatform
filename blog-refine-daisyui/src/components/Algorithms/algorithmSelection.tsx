import React, { useState } from "react";
import { Card, Select, Upload, Button, message, Form, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import dayjs, { Dayjs } from "dayjs";

interface Algorithm {
  id: string;
  name: string;
  description: string;
  communityId?: string;
  available?: boolean;
}

export interface IProsumerDataDTO {
  id?: string;
  batteryId?: string;
  batteryName?: string;
  userId?: string;
  userName?: string;
  email?: string;
  communityId?: string;
  communityName?: string;
}

interface AlgorithmUploadSectionProps {
  prosumers: IProsumerDataDTO[];
}

const mockAlgorithms: Algorithm[] = [
  { id: "alg1", name: "Basic Optimizer", description: "Sets optimal energy transactions.",available: true },
  { id: "alg2", name: "Load Balancer", description: "Distributes loads across network nodes.", available: false },
  { id: "alg3", name: "Demand Predictor", description: "Predicts energy demand using historical data.",available: false },
];

const AlgorithmUploadSection: React.FC<AlgorithmUploadSectionProps> = ({ prosumers }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [features, setFeatures] = useState<Record<string, { battery: boolean; load: boolean; photovoltaicLoad: boolean }>>({});

  const prosumerIds = (prosumers ?? [])
  .filter((p): p is IProsumerDataDTO => p?.id != null)
  .map((p) => p.id!);


  const handleFeatureChange = (
    prosumerId: string,
    featureKey: keyof (typeof features)[string],
    value: boolean
  ) => {
    setFeatures((prev) => ({
      ...prev,
      [prosumerId]: {
        ...prev[prosumerId],
        [featureKey]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedAlgorithm) {
      message.error("Please select an algorithm.");
      return;
    }
    if (!selectedFile) {
      message.error("Please upload an Excel file.");
      return;
    }
    if (!startDate || !endDate) {
      message.error("Please select a start and end date.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("prosumers", JSON.stringify(prosumerIds));
    formData.append("start_date_str", startDate.format("YYYY-MM-DD"));
    formData.append("end_date_str", endDate.format("YYYY-MM-DD"));
    formData.append("algorithm_id", selectedAlgorithm);

    const featuresPerProsumer = prosumerIds.reduce((acc, id) => {
      acc[id] = features[id] || { battery: false, load: false, photovoltaicLoad: false };
      return acc;
    }, {} as Record<string, { battery: boolean; load: boolean; photovoltaicLoad: boolean }>);

    formData.append("features", JSON.stringify(featuresPerProsumer));

    console.log("Submitting data:", {
      prosumers: prosumerIds,
      features: featuresPerProsumer,
    });

    try {
      const response = await fetch("http://localhost:8000/run-optimization", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : { detail: "Unknown error" };
        throw new Error(errorData.detail || "Upload failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success("Optimization data loaded successfully!");
    } catch (error: any) {
      message.error(`Failed to load optimization data: ${error.message}`);
    }
  };

  const [defineProsumerFeatures, setDefineProsumerFeatures] = useState<boolean>(false);

  return (
    <Card
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CloudArrowUpIcon style={{ width: 24, height: 24 }} />
          Upload Community Data
        </span>
      }
    >
      <Form layout="vertical">
        <Form.Item label="Select Algorithm" required>
          <Select
            placeholder="Choose an algorithm"
            onChange={(value) => setSelectedAlgorithm(value)}
            options={mockAlgorithms.map((alg) => ({
              value: alg.id,
              label: `${alg.name} - ${alg.description}`,
              disabled: alg.available === false,
            }))}
          />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item label="Start Date" required className="flex-1">
            <DatePicker
              value={startDate}
              onChange={(date) => setStartDate(date)}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="End Date" required className="flex-1">
            <DatePicker
              value={endDate}
              onChange={(date) => setEndDate(date)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>

        <Form.Item >
          <div className="flex flex-col gap-4">
            <Button
              className="btn btn-neutral"
              onClick={() => setDefineProsumerFeatures((prev) => !prev)}
              style={{ marginBottom: 12, width: "fit-content" }}
            >
              {defineProsumerFeatures ? "Minimize" : "Define"} Prosumer Features
            </Button>
            {defineProsumerFeatures && (
              <>
          {prosumerIds.map((id) => {
            const prosumer = prosumers.find((p) => p.id === id);
            return (
              <fieldset
                key={id}
                className="border border-base-300 rounded-lg p-4 shadow-sm bg-base-100"
              >
                <legend className="font-semibold text-sm mb-2">
            Prosumer: {prosumer?.userName || id} - ID: {id}
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["battery", "load", "photovoltaicLoad"] as const).map((featureKey) => {
              // Default to true if not set
              const checkedValue = features[id]?.[featureKey];
              const isOn = checkedValue === undefined ? true : checkedValue === true;
              return (
                <div key={featureKey}>
                  <div className="text-sm font-medium mb-1">{featureKey}</div>
                  <div className="flex items-center gap-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-${featureKey}`}
                  className="radio radio-success"
                  checked={isOn}
                  onChange={() => handleFeatureChange(id, featureKey, true)}
                />
                <span className="label-text ml-2">On</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-${featureKey}`}
                  className="radio radio-error"
                  checked={!isOn}
                  onChange={() => handleFeatureChange(id, featureKey, false)}
                />
                <span className="label-text ml-2">Off</span>
              </label>
                  </div>
                </div>
              );
            })}
                </div>
              </fieldset>
            );
          })}
              </>
            )}
          </div>
        </Form.Item>

        <Form.Item label="Upload Excel File" required>
          <Upload
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false;
            }}
            maxCount={1}
            accept=".xlsx,.xls"
          >
            <Button icon={<UploadOutlined />}>Select Excel File</Button>
          </Upload>
          {selectedFile && <p className="mt-2 text-sm">Selected file: {selectedFile.name}</p>}
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AlgorithmUploadSection;
