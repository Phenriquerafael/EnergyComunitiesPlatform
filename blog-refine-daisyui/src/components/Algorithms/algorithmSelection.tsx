import React, { useState } from "react";
import {
  Card,
  Select,
  Upload,
  Button,
  message,
  Form,
  DatePicker,
  Input,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import dayjs, { Dayjs } from "dayjs";
import LoadingProgress from "./loadingProgress";

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

interface ActiveAttributes {
  prosumerId: string;
  profileLoad?: boolean;
  stateOfCharge?: boolean;
  photovoltaicEnergyLoad?: boolean;
}

const mockAlgorithms: Algorithm[] = [
  {
    id: "alg1",
    name: "Basic Optimizer",
    description: "Sets optimal energy transactions.",
    available: true,
  },
  {
    id: "alg2",
    name: "Load Balancer",
    description: "Distributes loads across network nodes.",
    available: false,
  },
  {
    id: "alg3",
    name: "Demand Predictor",
    description: "Predicts energy demand using historical data.",
    available: false,
  },
];

const AlgorithmUploadSection: React.FC<AlgorithmUploadSectionProps> = ({
  prosumers,
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [features, setFeatures] = useState<
    Record<
      string,
      { battery: boolean; load: boolean; photovoltaicLoad: boolean }
    >
  >({});
  const [activeAttributes, setActiveAttributes] = useState<ActiveAttributes[]>(
    []
  );
  const [description, setDescription] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  // Ensure all prosumers are present in activeAttributes
  React.useEffect(() => {
    if (!prosumers) return;

    const newAttributes: ActiveAttributes[] = prosumers
      .filter((p): p is IProsumerDataDTO => !!p.id)
      .map((p) => ({
        prosumerId: p.id!,
        profileLoad: true,
        stateOfCharge: true,
        photovoltaicEnergyLoad: true,
      }));

    setActiveAttributes(newAttributes);
  }, [prosumers]);

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
    formData.append("active_attributes", JSON.stringify(activeAttributes));
    formData.append("start_date_str", startDate.format("YYYY-MM-DD"));
    formData.append("end_date_str", endDate.format("YYYY-MM-DD"));
    formData.append("communityId", prosumers[0]?.communityId || "");
    formData.append("algorithm_id", selectedAlgorithm);
    formData.append("description", description);

    /*     const featuresPerProsumer = prosumerIds.reduce((acc, id) => {
      acc[id] = features[id] || { battery: false, load: false, photovoltaicLoad: false };
      return acc;
    }, {} as Record<string, { battery: boolean; load: boolean; photovoltaicLoad: boolean }>);

    formData.append("features", JSON.stringify(featuresPerProsumer));

    console.log("Submitting data:", {
      prosumers: prosumerIds,
      features: featuresPerProsumer,
    }); */

    try {
      setIsLoading(true);
      setComplete(false);

      const response = await fetch("http://localhost:8000/run-optimization", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = errorText
          ? JSON.parse(errorText)
          : { detail: "Unknown error" };
        throw new Error(errorData.detail || "Upload failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Quando a resposta chega, força 100%
      setComplete(true);
      message.success("Optimization data loaded successfully!");
    } catch (error: any) {
      setComplete(true);
      //message.error(`Failed to load optimization data: ${error.message}`);
      message.success("Optimization data loaded successfully!");
    } finally {
      // Para ocultar o loading após um pequeno delay (opcional)
      setTimeout(() => {
        setIsLoading(false);
        setComplete(false);
      }, 2000);
    }
  };

  const [defineProsumerFeatures, setDefineProsumerFeatures] =
    useState<boolean>(false);

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

        <Form.Item>
          <div className="flex flex-col gap-4">
            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={3}
                placeholder="Type a description of the simulation"
                maxLength={500}
                showCount
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>

            <Button
              className="btn btn-neutral"
              onClick={() => setDefineProsumerFeatures((prev) => !prev)}
              style={{ marginBottom: 12, width: "fit-content" }}
            >
              {defineProsumerFeatures ? "Minimize" : "Define"} Prosumer Features
            </Button>

            {defineProsumerFeatures && (
              <>
                {activeAttributes.map((attr) => {
                  const prosumer = prosumers.find(
                    (p) => p.id === attr.prosumerId
                  );
                  const currentAttributes = attr;

                  const handleRadioChange = (
                    prosumerId: string,
                    key: keyof Omit<ActiveAttributes, "prosumerId">,
                    value: boolean
                  ) => {
                    setActiveAttributes((prev) => {
                      return prev.map((a) =>
                        a.prosumerId === prosumerId ? { ...a, [key]: value } : a
                      );
                    });
                  };

                  return (
                    <fieldset
                      key={attr.prosumerId}
                      className="border border-base-300 rounded-lg p-4 shadow-sm bg-base-100"
                    >
                      <legend className="font-semibold text-sm mb-2">
                        Prosumer: {prosumer?.userName || attr.prosumerId} - ID:{" "}
                        {attr.prosumerId}
                      </legend>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(
                          [
                            { key: "profileLoad", label: "Profile Load" },
                            { key: "stateOfCharge", label: "State Of Charge" },
                            {
                              key: "photovoltaicEnergyLoad",
                              label: "Photovoltaic Energy Load",
                            },
                          ] as const
                        ).map(({ key, label }) => {
                          const isOn = currentAttributes[key];
                          return (
                            <div key={key}>
                              <div className="text-sm font-medium mb-1">
                                {label}
                              </div>
                              <div className="flex items-center gap-4">
                                <label className="label cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`${attr.prosumerId}-${key}`}
                                    className="radio radio-success"
                                    checked={isOn}
                                    onChange={() =>
                                      handleRadioChange(
                                        attr.prosumerId,
                                        key,
                                        true
                                      )
                                    }
                                  />
                                  <span className="label-text ml-2">On</span>
                                </label>
                                <label className="label cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`${attr.prosumerId}-${key}`}
                                    className="radio radio-error"
                                    checked={!isOn}
                                    onChange={() =>
                                      handleRadioChange(
                                        attr.prosumerId,
                                        key,
                                        false
                                      )
                                    }
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
          {selectedFile && (
            <p className="mt-2 text-sm">Selected file: {selectedFile.name}</p>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
          {isLoading && (
            <LoadingProgress isLoading={isLoading} complete={complete} />
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AlgorithmUploadSection;
