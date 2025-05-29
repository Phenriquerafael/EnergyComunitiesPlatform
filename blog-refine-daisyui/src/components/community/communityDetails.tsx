import React, { useState } from "react";
import { Descriptions, Spin, Select, Button, message, Typography, Divider } from "antd";
import { useOne, useList, useCustomMutation } from "@refinedev/core";

const { Title } = Typography;

interface CommunityDetailsProps {
  communityId: string;
}

const CommunityDetails: React.FC<CommunityDetailsProps> = ({ communityId }) => {
  const [selectedProsumersToAdd, setSelectedProsumersToAdd] = useState<string[]>([]);
  const [selectedProsumersToRemove, setSelectedProsumersToRemove] = useState<string[]>([]);

  const { data, isLoading } = useOne({
    resource: "communities/id",
    id: communityId,
  });

  const { data: prosumerData, isLoading: isProsumersLoading } = useList({
    resource: "prosumers/all2",
  });

  const { mutate: addProsumers, isLoading: isAdding } = useCustomMutation();
  const { mutate: removeProsumers, isLoading: isRemoving } = useCustomMutation();

  const onAddProsumers = () => {
    if (selectedProsumersToAdd.length === 0) {
      message.warning("Please select at least one prosumer to add.");
      return;
    }

    const payload = {
      communityId,
      prosumers: selectedProsumersToAdd.map((prosumerId) => ({ prosumerId })),
    };

    addProsumers(
      {
        url: "prosumers/addToCommunity",
        method: "patch",
        values: payload,
      },
      {
        onSuccess: () => {
          message.success("Prosumers added successfully!");
          setSelectedProsumersToAdd([]);
        },
        onError: () => {
          message.error("Failed to add prosumers.");
        },
      }
    );
  };

  const onRemoveProsumers = () => {
    if (selectedProsumersToRemove.length === 0) {
      message.warning("Please select at least one prosumer to remove.");
      return;
    }

    const payload = {
      communityId,
      prosumers: selectedProsumersToRemove.map((prosumerId) => ({ prosumerId })),
    };

    removeProsumers(
      {
        url: "prosumers/removeFromCommunity",
        method: "patch",
        values: payload,
      },
      {
        onSuccess: () => {
          message.success("Prosumers removed successfully!");
          setSelectedProsumersToRemove([]);
        },
        onError: () => {
          message.error("Failed to remove prosumers.");
        },
      }
    );
  };

  if (isLoading || isProsumersLoading) {
    return <Spin />;
  }

  const community = data?.data;
  const prosumersInCommunity = prosumerData?.data.filter((p) => p.communityId === communityId);
  const prosumersNotInCommunity = prosumerData?.data.filter((p) => p.communityId !== communityId);

  return (
    <>
      <Descriptions title="Community Details" bordered column={1}>
        <Descriptions.Item label="Name">{community?.name}</Descriptions.Item>
        <Descriptions.Item label="Description">{community?.description}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Prosumers in this Community</Title>

      <Select
        mode="multiple"
        placeholder="Select prosumers to remove"
        style={{ width: "100%", marginBottom: 16 }}
        loading={isProsumersLoading}
        onChange={(values) => setSelectedProsumersToRemove(values)}
        value={selectedProsumersToRemove}
        optionLabelProp="label"
        options={prosumersInCommunity?.map((p) => ({
          value: p.id,
          label: p.userName ?? `Prosumer ${p.id}`,
        }))}
      />

      <Button
        danger
        onClick={onRemoveProsumers}
        loading={isRemoving}
        disabled={selectedProsumersToRemove.length === 0}
        style={{ marginBottom: 24 }}
      >
        Remove Selected Prosumers
      </Button>

      <Divider />

      <Title level={4}>Add Prosumers to Community</Title>

      <Select
        mode="multiple"
        placeholder="Select prosumers to add"
        style={{ width: "100%", marginBottom: 16 }}
        loading={isProsumersLoading}
        onChange={(values) => setSelectedProsumersToAdd(values)}
        value={selectedProsumersToAdd}
        optionLabelProp="label"
        options={prosumersNotInCommunity?.map((p) => ({
          value: p.id,
          label: `${p.userName ?? `Prosumer ${p.id}`} - ${p.email ?? ''}`,
        }))}
      />

      <Button
        type="primary"
        onClick={onAddProsumers}
        loading={isAdding}
        disabled={selectedProsumersToAdd.length === 0}
      >
        Add Selected Prosumers
      </Button>
    </>
  );
};

export default CommunityDetails;