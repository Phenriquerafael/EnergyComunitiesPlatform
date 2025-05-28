import React, { useState } from "react";
import { Form, Input, Select, Button, message, Spin } from "antd";
import { useList, useCreate, useUpdate } from "@refinedev/core";

interface CommunityFormProps {
  userId: string;
}

const CommunityForm: React.FC<CommunityFormProps> = ({ userId }) => {
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
                message.success("Comunidade criada com sucesso!");
              },
              onError: () => {
                message.error("Erro ao criar o gerente da comunidade.");
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
                message.success("Prosumer(s) atualizado(s) com sucesso!");
              },
              onError: () => {
                message.error("Erro ao atualizar os prosumers.");
              },
              }
            );
            }
        },
        onError: () => {
          message.error("Erro ao criar a comunidade.");
        },
      }
    );
  };

  if (isProsumersLoading) {
    return <Spin />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Nome da Comunidade"
        name="name"
        rules={[{ required: true, message: "Por favor, insira o nome da comunidade." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Descrição" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Selecionar Prosumer">
        <Select
          mode="multiple"
          placeholder="Select a prosumer"
          style={{ width: "100%" }}
          loading={isProsumersLoading}
          onChange={(id) => {
        const selected = prosumerData?.data.find((p) => p.id === id);
        setSelectedProsumers(selected ? [selected] : []);
          }}
          optionLabelProp="label"
          options={prosumerData?.data.map((p) => ({
        value: p.id,
        label: `${p.userName ?? `Prosumer ${p.id}`} - ${p.email ? `Email: ${p.email}` : ''}${p.batteryName ? ` -  Battery: ${p.batteryName}` : ''}${p.communityName ? ` -  Community: ${p.communityName}` : ''}`,
        render: () => (
          <div style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            <strong>{p.userName ?? `Prosumer ${p.id}`}</strong>
            <div style={{ color: "#666", fontSize: 12 }}>
          {p.email && <span>Email: {p.email}</span>}
          {p.batteryName && <span> | Battery: {p.batteryName}</span>}
          {p.communityName && <span> | Community: {p.communityName}</span>}
            </div>
          </div>
        ),
          }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isCreatingCommunity}>
          Criar Comunidade
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommunityForm;
