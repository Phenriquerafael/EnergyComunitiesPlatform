import React, { useState } from "react";
import { Form, Input, Select, Button, message, Spin } from "antd";
import { useList, useCreate, useUpdate } from "@refinedev/core";

interface CommunityFormProps {
  userId: string;
  onSuccess?: () => void; // callback para notificar sucesso
}

const CommunityForm: React.FC<CommunityFormProps> = ({ userId, onSuccess }) => {
  const [form] = Form.useForm();
  const [selectedProsumers, setSelectedProsumers] = useState<string[]>([]);

  const { data: prosumerData, isLoading: isProsumersLoading } = useList({
    resource: "prosumers/all2",
  });

  const { mutate: createCommunity, isLoading: isCreatingCommunity } = useCreate();
  const { mutate: createCommunityManager } = useCreate();
  const { mutate: updateProsumers, isLoading: isUpdating } = useUpdate();

  const onFinish = (values: any) => {
    createCommunity(
      {
        resource: "communities",
        values: {
          name: values.name,
          description: values.description,
        },
      },
      {
        onSuccess: (communityResponse) => {
          const newCommunity = communityResponse.data;

          createCommunityManager(
            {
              resource: "communityManager",
              values: {
                userId,
                communityId: newCommunity.id,
              },
            },
            {
              onSuccess: () => {
                message.success("Community created successfully!");
                onSuccess?.(); // Notifica o componente pai
              },
              onError: () => {
                message.error("Error assigning community manager.");
              },
            }
          );

          if (selectedProsumers.length > 0) {
            const payload = {
              communityId: newCommunity.id,
              prosumers: selectedProsumers.map((prosumerId: string) => ({
                prosumerId,
              })),
            };

            updateProsumers(
              {
                resource: "prosumers/addToCommunity",
                values: payload,
              },
              {
                onSuccess: () => {
                  message.success("Prosumers assigned to community successfully!");
                },
                onError: () => {
                  message.error("Failed to assign prosumers.");
                },
              }
            );
          }
        },
        onError: () => {
          message.error("Failed to create community.");
        },
      }
    );
  };

  if (isProsumersLoading) return <Spin />;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Community Name"
        name="name"
        rules={[{ required: true, message: "Please enter the community name." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Assign Prosumers">
        <Select
          mode="multiple"
          placeholder="Select prosumers"
          style={{ width: "100%" }}
          loading={isProsumersLoading}
          onChange={(values) => setSelectedProsumers(values)}
          value={selectedProsumers}
          options={prosumerData?.data.map((p) => ({
            value: p.id,
            label: `${p.userName ?? `Prosumer ${p.id}`} - ${p.email ?? ''} ${p.batteryName ? ` - Battery: ${p.batteryName}` : ''} ${p.communityName ? ` - Community: ${p.communityName}` : ''}`,
          }))}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isCreatingCommunity || isUpdating}>
          Create Community
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommunityForm;
