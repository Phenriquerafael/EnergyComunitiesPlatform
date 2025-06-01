import React, { useState } from "react";
import { Card, Select, Upload, Button, message, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";

interface Algorithm {
  id: string;
  name: string;
  description: string;
  communityId?: string; // Opcional, se necessário para filtrar por comunidade
}

const mockAlgorithms: Algorithm[] = [
  { id: "alg1", name: "Battery Optimizer", description: "Optimizes battery for energy consumption." },
  { id: "alg2", name: "Load Balancer", description: "Distributes loads across network nodes." },
  { id: "alg3", name: "Demand Predictor", description: "Predicts energy demand using historical data." },
];

const AlgorithmUploadSection: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!selectedAlgorithm) {
      message.error("Please select an algorithm.");
      return;
    }

    if (!selectedFile) {
      message.error("Please upload an Excel file.");
      return;
    }

    // Simula submissão
    message.success("Data uploaded successfully!");
    console.log("Submitted:", { selectedAlgorithm, selectedFile });
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

        <Form.Item label="Upload Excel File" required>
          <Upload
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false; // impede upload automático
            }}
            maxCount={1}
            accept=".xlsx,.xls"
          >
            <Button icon={<UploadOutlined />}>Select Excel File</Button>
          </Upload>
          {selectedFile && <p style={{ marginTop: 8 }}>Selected file: {selectedFile.name}</p>}
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
