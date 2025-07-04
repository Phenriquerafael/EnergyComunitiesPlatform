import React, { useState } from "react";
import { Descriptions, Spin, Select, Button, message, Typography, Divider, Card } from "antd";
import { useOne, useList, useCustomMutation, useDelete, BaseKey } from "@refinedev/core";
import ProsumerTableBody from "../prosumers/prosumerTableBody";
import AlgorithmUploadSection from "../Algorithms/algorithmSelection";
import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import Flag from 'react-world-flags';
import { IProsumerDataDTO } from "../../interfaces";

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

  const { data: prosumerData, isLoading: isProsumersLoading, refetch: refetchProsumers } = useList({
    resource: "prosumers/all2",
  });

  const { data: communityProsumersData, isLoading: isCommunityProsumersLoading, refetch: refetchCommunityProsumers } = useList({
    resource: `prosumers/community/${communityId}`,
  });

  const { mutate: addProsumers, isLoading: isAdding } = useCustomMutation();
  const { mutate: removeProsumers, isLoading: isRemoving } = useCustomMutation();

  const { mutate: deleteMany } = useDelete();

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
          setSelectedProsumersToAdd([]);
          refetchProsumers(); // Atualiza a lista de todos os prosumers
          refetchCommunityProsumers(); // Atualiza a lista de prosumers na comunidade
          message.success("Prosumers added successfully!");
        },
        onError: (error) => {
          message.error(`Failed to add prosumers: ${error.message || "Unknown error"}`);
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
          refetchProsumers(); // Atualiza a lista de todos os prosumers
          refetchCommunityProsumers(); // Atualiza a lista de prosumers na comunidade
        },
        onError: (error) => {
          message.error(`Failed to remove prosumers: ${error.message || "Unknown error"}`);
        },
      }
    );

  };

  if (isLoading || isProsumersLoading || isCommunityProsumersLoading) {
    return <Spin />;
  }

  const community = data?.data;
  const prosumersInCommunity = communityProsumersData?.data as IProsumerDataDTO[];
  const prosumersNotInCommunity = prosumerData?.data.filter((p) => !prosumersInCommunity?.some((cp) => cp.id === p.id));

  function handleDeleteProfiles(id: string) {

    deleteMany(
      {
        resource: "profiles/community",
        id,
      },
      {
        onSuccess: () => {
          message.success("Profiles deleted successfully!"); // Mensagem de sucesso
          //refetch(); // Recarrega a lista após sucesso
        },
        onError: (error) => {
          message.error(
            `Failed to delete profiles: ${error.message || "Unknown error"}`
          ); // Mensagem de erro
        },
      }
    );

  }

  return (
    <>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Country">
          <span className="flex items-center gap-2">
            <Flag code={community?.country ?? "pt"} style={{ width: 24, height: 16 }} />
            {community?.country ?? "Portugal"}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Name">{community?.name}</Descriptions.Item>
        <Descriptions.Item label="Description">{community?.description}</Descriptions.Item>
      </Descriptions>

      <Divider />


        <Title level={4}>Prosumers in this Community</Title>

      <ProsumerTableBody
        prosumers={prosumersInCommunity?.map((p) => ({
          ...p,
          id: p.id?.toString(),
        })) || []}
      />

      <br />
      <br />

      <div className="flex flex-col gap-5 md:flex-row" style={{ flexWrap: "wrap" }}>
        <Card
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserMinusIcon style={{ width: 24, height: 24 }} />
              Remove from Community
            </span>
          }
          style={{ minWidth: 250, flex: 1, marginRight: 0, maxWidth: "100%" }}
          bodyStyle={{ padding: 16 }}
        >
          <Select
            mode="multiple"
            placeholder="Select prosumers to remove"
            style={{ width: "100%", marginBottom: 16 }}
            loading={isProsumersLoading || isCommunityProsumersLoading}
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
            style={{ marginBottom: 24, width: "100%" }}
          >
            Remove Selected Prosumers
          </Button>
        </Card>

        <Card
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserPlusIcon style={{ width: 24, height: 24 }} />
              Add to Community
            </span>
          }
          style={{ minWidth: 250, flex: 1, maxWidth: "100%" }}
          bodyStyle={{ padding: 16 }}
        >
          <Select
            mode="multiple"
            placeholder="Select prosumers to add"
            style={{ width: "100%", marginBottom: 16 }}
            loading={isProsumersLoading || isCommunityProsumersLoading}
            onChange={(values) => setSelectedProsumersToAdd(values)}
            value={selectedProsumersToAdd}
            optionLabelProp="label"
            options={prosumersNotInCommunity?.map((p) => ({
              value: p.id,
              label: `${p.userName ?? `Prosumer ${p.id}`} - ${p.email ?? ""}`,
            }))}
          />
          <Button
            type="primary"
            onClick={onAddProsumers}
            loading={isAdding}
            disabled={selectedProsumersToAdd.length === 0}
            style={{ width: "100%" }}
          >
            Add Selected Prosumers
          </Button>
        </Card>
      </div>

            <br />
      <button
        className="btn btn-error btn-sm text-white"
        onClick={async () => {
          if (
        window.confirm(
          "Are you sure you want to remove all prosumers data from this community? This action cannot be undone."
        )
          ) {
        handleDeleteProfiles(communityId);
          }
        }}
        disabled={!prosumersInCommunity || prosumersInCommunity.length === 0}
      >
        Remove All Prosumers Data
      </button>
      <Divider />

      <AlgorithmUploadSection prosumers={prosumersInCommunity ?? []} />
    </>
  );
};

export default CommunityDetails;