import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions, Select } from "antd";
import { Line } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { IProsumerDataDTO, ProfileDTO } from "../interfaces";

const intervalToTime = (interval: number): string => {
  const totalMinutes = (interval - 1) * 15;
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const ProfileAnalyticsPage = () => {
  const [selectedProsumer, setSelectedProsumer] = useState<IProsumerDataDTO | undefined>(undefined);
  const [profiles, setProfiles] = useState<ProfileDTO[]>([]);

  const { data: prosumerData, isLoading: isProsumersLoading } = useList<IProsumerDataDTO>({
    resource: "prosumers/all2",
  });

  const prosumers = prosumerData?.data ?? [];

  const { data: profileData, isLoading: isProfilesLoading } = useList<ProfileDTO>({
    resource: selectedProsumer?.id ? `profiles/prosumer/${selectedProsumer.id}` : "",
    queryOptions: {
      enabled: !!selectedProsumer?.id,
    },
  });

  useEffect(() => {
    if (Array.isArray(profileData?.data)) {
      setProfiles(profileData.data);
    } else {
      setProfiles([]);
    }
  }, [profileData]);

  const generateChartData = () => {
    if (!Array.isArray(profiles)) return [];

    return profiles.flatMap((profile) => {
      const time = intervalToTime(Number(profile.numberOfIntervals));
      return [
        { time, type: "State of Charge", value: parseFloat(profile.stateOfCharge || "0") },
        { time, type: "Energy Charge", value: parseFloat(profile.energyCharge || "0") },
        { time, type: "Energy Discharge", value: parseFloat(profile.energyDischarge || "0") },
        { time, type: "Photovoltaic Energy Load", value: parseFloat(profile.photovoltaicEnergyLoad || "0") },
        { time, type: "Bought Energy", value: parseFloat(profile.boughtEnergyAmount || "0") },
        { time, type: "Sold Energy", value: parseFloat(profile.soldEnergyAmount || "0") },
        { time, type: "Peer Output Energy Load", value: parseFloat(profile.peerOutputEnergyLoad || "0") },
        { time, type: "Peer Input Energy Load", value: parseFloat(profile.peerInputEnergyLoad || "0") },
        { time, type: "Profile Load", value: parseFloat(profile.profileLoad || "0") },
      ];
    });
  };

  const calculateAverage = (key: keyof ProfileDTO): string => {
    const numericValues = profiles
      .map((p) => parseFloat(p[key] as string ?? "0"))
      .filter((v) => !isNaN(v));
    const avg = numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length;
    return avg.toFixed(2);
  };

  const averageFields = [
    { label: "Average State of Charge", key: "stateOfCharge" },
    { label: "Average Energy Charged", key: "energyCharge" },
    { label: "Average Energy Discharged", key: "energyDischarge" },
    { label: "Average PV Energy Load", key: "photovoltaicEnergyLoad" },
    { label: "Average Energy Bought", key: "boughtEnergyAmount" },
    { label: "Average Energy Sold", key: "soldEnergyAmount" },
    { label: "Average Peer Output Load", key: "peerOutputEnergyLoad" },
    { label: "Average Peer Input Load", key: "peerInputEnergyLoad" },
    { label: "Average Profile Load", key: "profileLoad" },
  ];

  const chartData = generateChartData();

  const chartConfig = {
    data: chartData,
    xField: "time",
    yField: "value",
    seriesField: "type",
    renderer: "svg", // 👈 corrige o erro CanvasDirection
    xAxis: {
      title: { text: "Time (HH:mm)" },
      label: { rotate: 45 },
    },
    yAxis: {
      title: { text: "Value (kWh)" },
    },
    tooltip: {
      fields: ["time", "type", "value"],
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value} kWh`,
      }),
    },
  };

  const prosumerProfile = profiles.length > 0 ? profiles[0] : null;

  return (
    <Card title="Profile Analytics">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
        <Select
          placeholder="Select a prosumer"
          style={{ width: "100%" }}
          loading={isProsumersLoading}
          onChange={(id) => {
            const selected = prosumers.find((p) => p.id === id);
            setSelectedProsumer(selected);
          }}
          optionLabelProp="label"
          options={prosumers.map((p) => ({
            value: p.id,
            label: `${p.userName ?? `Prosumer ${p.id}`} - ${p.email ? `Email: ${p.email}` : ''}${p.batteryName ? ` -  Battery: ${p.batteryName}` : ''}${p.communityName ? ` -  Community: ${p.communityName}` : ''}`,
            // Para exibição customizada no dropdown
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
        </Col>
      </Row>

      {isProfilesLoading ? (
        <p>Loading profiles...</p>
      ) : (
        <>
          <Row gutter={16}>
            <Col span={24}>
              {/* <Card title={`Temporal Evolution for Prosumer: ${selectedProsumer?.userName ?? selectedProsumer?.id}`}> */}
              <Card title={`Data Resolution for Time`}>
                <Line {...chartConfig} height={400} />
              </Card>
            </Col>
          </Row>

          {prosumerProfile && (
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={24}>
                <Card title={`Prosumer ${selectedProsumer?.userName} – Profile Details`}>
                  <Descriptions column={2}>
                    <Descriptions.Item label="Prosumer ID">{prosumerProfile.prosumerId}</Descriptions.Item>
                    <Descriptions.Item label="Date">{prosumerProfile.date}</Descriptions.Item>
                    <Descriptions.Item label="Interval">{prosumerProfile.intervalOfTime}</Descriptions.Item>
                    <Descriptions.Item label="State of Charge">{prosumerProfile.stateOfCharge} kWh</Descriptions.Item>
                    <Descriptions.Item label="Energy Charged">{prosumerProfile.energyCharge} kWh</Descriptions.Item>
                    <Descriptions.Item label="Energy Discharged">{prosumerProfile.energyDischarge} kWh</Descriptions.Item>
                    <Descriptions.Item label="PV Energy Load">{prosumerProfile.photovoltaicEnergyLoad} kWh</Descriptions.Item>
                    <Descriptions.Item label="Energy Bought">{prosumerProfile.boughtEnergyAmount} kWh</Descriptions.Item>
                    <Descriptions.Item label="Energy Sold">{prosumerProfile.soldEnergyAmount} kWh</Descriptions.Item>
                    <Descriptions.Item label="Profile Load">{prosumerProfile.profileLoad} kWh</Descriptions.Item>
                    <br /><br />
                    {averageFields.map((field) => (
                      <Descriptions.Item key={field.key} label={field.label}>
                        {calculateAverage(field.key as keyof ProfileDTO)} kWh
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </Card>
  );
};
