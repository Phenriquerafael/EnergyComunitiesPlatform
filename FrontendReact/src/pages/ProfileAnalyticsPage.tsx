import { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions } from "antd";
import { Line } from "@ant-design/plots";
import type { ProfileDTO } from "../interfaces";
import { getAllProfiles } from "../services/profileService";


export const ProfileAnalyticsPage = () => {
  const [profiles, setProfiles] = useState<ProfileDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

/*   const prosumerId = "95c39ad2-b750-45dc-9dfb-3e83283637c7";  */
  const prosumerId = "39bd4b18-76a3-496d-b428-ab22bdb23bc3"; // Replace with the actual prosumer ID



  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = (await getAllProfiles()) as ProfileDTO[];
        setProfiles(data.filter((p) => p.prosumerId === prosumerId));
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [prosumerId]);

  const intervalToTime = (interval: number): string => {
    const totalMinutes = (interval - 1) * 15;
    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const generateChartData = () => {
    return profiles.map((profile) => {
      const interval = Number(profile.numberOfIntervals);
      const time = intervalToTime(interval);

      return [
        {
          time,
          type: "State of Charge",
          value: parseFloat(profile.stateOfCharge || "0"),
        },
        {
          time,
          type: "Energy Charge",
          value: parseFloat(profile.energyCharge || "0"),
        },
        {
          time,
          type: "Energy Discharge",
          value: parseFloat(profile.energyDischarge || "0"),
        },
        {
          time,
          type: "Photovoltaic Energy Load",
          value: parseFloat(profile.photovoltaicEnergyLoad || "0"),
        },
        {
          time,
          type: "Bought Energy",
          value: parseFloat(profile.boughtEnergyAmount || "0"),
        },
        {
          time,
          type: "Sold Energy",
          value: parseFloat(profile.soldEnergyAmount || "0"),
        },
        {
          time,
          type: "Peer Output Energy Load",
          value: parseFloat(profile.peerOutputEnergyLoad || "0"),
        },
        {
          time,
          type: "Peer Input Energy Load",
          value: parseFloat(profile.peerInputEnergyLoad || "0"),
        },
        {
          time,
          type: "Profile Load",
          value: parseFloat(profile.profileLoad || "0"),
        },
      ];
    }).flat();
  };

  const chartData = generateChartData();

  const config = {
    data: chartData,
    xField: "time",
    yField: "value",
    seriesField: "type",
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

    // Função para calcular a média de um campo numérico em string
    const calculateAverage = (key: keyof ProfileDTO): string => {
      const numericValues = profiles
        .map((p) => parseFloat(String(p[key] || "0")))
        .filter((v) => !isNaN(v));
  
      const average =
        numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length;
  
      return average.toFixed(2);
    };
  
    // Campos a serem exibidos com suas médias
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

  return (
    <Card title="Profile Analytics">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Card title={`Temporal Evolution for Prosumer ${prosumerId}`}>
                <Line {...config} height={400} />
              </Card>
            </Col>
          </Row>

          {prosumerProfile && (
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={24}>
                <Card title={`Prosumer ${prosumerId} – Profile Details`}>
                <Descriptions column={2}>
                  <Descriptions.Item label="Prosumer ID">
                    {prosumerProfile.prosumerId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {prosumerProfile.date}
                  </Descriptions.Item>
                  <Descriptions.Item label="Time Interval">
                    {prosumerProfile.intervalOfTime}
                  </Descriptions.Item>

                  <Descriptions.Item label="State of Charge">
                    {prosumerProfile.stateOfCharge} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="Energy Charged">
                    {prosumerProfile.energyCharge} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="Energy Discharged">
                    {prosumerProfile.energyDischarge} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="PV Energy Load">
                    {prosumerProfile.photovoltaicEnergyLoad} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="Energy Bought">
                    {prosumerProfile.boughtEnergyAmount} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="Energy Sold">
                    {prosumerProfile.soldEnergyAmount} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="Profile Load">
                    {prosumerProfile.profileLoad} kWh
                  </Descriptions.Item>

                  {/* MÉDIAS */}
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