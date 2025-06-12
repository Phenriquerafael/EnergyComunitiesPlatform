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
}

interface AlgorithmUploadSectionProps {
  prosumerIds: string[];
}

const mockAlgorithms: Algorithm[] = [
  { id: "alg1", name: "Battery Optimizer", description: "Optimizes battery for energy consumption." },
  { id: "alg2", name: "Load Balancer", description: "Distributes loads across network nodes." },
  { id: "alg3", name: "Demand Predictor", description: "Predicts energy demand using historical data." },
];

const AlgorithmUploadSection: React.FC<AlgorithmUploadSectionProps> = ({ prosumerIds }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [features, setFeatures] = useState({
    battery: false,
    load: false,
    photovoltaicLoad: false,
  });

  const handleFeatureChange = (feature: keyof typeof features, value: boolean) => {
    setFeatures((prev) => ({ ...prev, [feature]: value }));
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

    console.log("Submitting data:", formData);  

    try {
      const response = await fetch("http://localhost:8000/run-optimization", {
        method: "POST",
        body: formData,
        //credentials: "include", // Handle CORS with credentials if needed
      });

      if (!response.ok) {
        const errorText = await response.text(); // Try text first to handle non-JSON
        const errorData = errorText ? JSON.parse(errorText) : { detail: "Unknown error" };
        throw new Error(errorData.detail || "Upload failed");
      }

      const result = await response.json();
      message.success("Optimization started successfully!");
    } catch (error: any) {
      message.error(`Failed to start optimization: ${error.message}`);
    }
  };

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

        <Form.Item label="Features">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              { key: "battery", label: "Battery" },
              { key: "load", label: "Load" },
              { key: "photovoltaicLoad", label: "Photovoltaic Load" },
            ] as const).map(({ key, label }) => (
              <fieldset
                key={key}
                className="border border-base-300 rounded-lg p-4 shadow-sm bg-base-100"
              >
                <legend className="font-semibold text-sm mb-2">{label}</legend>
                <div className="flex items-center gap-4">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name={key}
                      className="radio radio-success"
                      checked={features[key]}
                      onChange={() => handleFeatureChange(key, true)}
                    />
                    <span className="label-text ml-2">On</span>
                  </label>

                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name={key}
                      className="radio radio-error"
                      checked={!features[key]}
                      onChange={() => handleFeatureChange(key, false)}
                    />
                    <span className="label-text ml-2">Off</span>
                  </label>
                </div>
              </fieldset>
            ))}
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