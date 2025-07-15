import React, { useState } from "react";
import { Form, Input, Select, Button, message, Spin } from "antd";
import { useList, useCreate, useUpdate } from "@refinedev/core";
import Flag from 'react-world-flags';


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
    console.log("Form Values:", values);
    createCommunity(
      {
        resource: "communities",
        values: {
          name: values.name,
          description: values.description,
          country: values.country,
          countryCode: values.countryCode,
        },
      },

      {
        onSuccess: (communityResponse) => {
          const newCommunity = communityResponse.data;

/*           createCommunityManager(
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
          ); */

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
    <Form form={form} layout="vertical" onFinish={(values) => {
      // Map country selection to countryCode and country name
      const countryMap: Record<string, { code: string; name: string }> = {
      pt: { code: "pt", name: "Portugal" },
      es: { code: "es", name: "Spain" },
      fr: { code: "fr", name: "France" },
      de: { code: "de", name: "Germany" },
      it: { code: "it", name: "Italy" },
      uk: { code: "gb", name: "United Kingdom" },
      };
      const selectedCountry = countryMap[values.country];
      const newValues = {
      ...values,
      countryCode: selectedCountry?.code,
      country: selectedCountry?.name,
      };
      onFinish(newValues);
    }}>

      <Form.Item
      label="Country"
      name="country"
      initialValue="pt"
      rules={[{ required: true, message: "Please select a country." }]}
      >
      <Select
        placeholder="Select a country"
        options={[
        { value: "pt", label: <span className="flex items-center gap-2"><Flag code="pt" style={{ width: 24, height: 16 }} /> Portugal</span> },
        { value: "es", label: <span className="flex items-center gap-2"><Flag code="es" style={{ width: 24, height: 16 }} /> Spain</span> },
        { value: "fr", label: <span className="flex items-center gap-2"><Flag code="fr" style={{ width: 24, height: 16 }} /> France</span> },
        { value: "de", label: <span className="flex items-center gap-2"><Flag code="de" style={{ width: 24, height: 16 }} /> Germany</span> },
        { value: "it", label: <span className="flex items-center gap-2"><Flag code="it" style={{ width: 24, height: 16 }} /> Italy</span> },
        { value: "uk", label: <span className="flex items-center gap-2"><Flag code="gb" style={{ width: 24, height: 16 }} /> United Kingdom</span> },
        ]}
      />
      </Form.Item>
      
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
