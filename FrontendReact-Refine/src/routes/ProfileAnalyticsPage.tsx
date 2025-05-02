import { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions } from "antd";
import { Line } from "@ant-design/plots"; // Alterado para usar gráficos de linha
import { getAllProfiles } from "@/services/profileService"; // Ajuste conforme necessário
import { ProfileDTO } from "@/types/Profile";

export const ProfileAnalyticsPage = () => {
  const [profiles, setProfiles] = useState<ProfileDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = (await getAllProfiles()) as ProfileDTO[];
        setProfiles(data);
      } catch (error) {
        console.error("Erro ao buscar os perfis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Função para organizar os dados para o gráfico com base no número de intervalos
  const generateChartData = () => {
    return profiles.flatMap((profile, index) => {
      const { intervalOfTime, stateOfCharge, energyCharge, energyDischarge, photovoltaicEnergyLoad, boughtEnergyAmount, soldEnergyAmount, peerOutputEnergyLoad, peerInputEnergyLoad } = profile;

      // Usar 'index' como o número de intervalo para o eixo X
      const intervalIndex = index + 1; // Incrementar 1 para que o intervalo comece do 1

      // Aqui, você pode adicionar mais dados temporais conforme necessário
      return [
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "State of Charge",
          value: parseFloat(stateOfCharge || "0"),
        },
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "Energy Charge",
          value: parseFloat(energyCharge || "0"),
        },
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "Energy Discharge",
          value: parseFloat(energyDischarge || "0"),
        },
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "Photovoltaic Energy Load",
          value: parseFloat(photovoltaicEnergyLoad || "0"),
        },
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "Bought Energy",
          value: parseFloat(boughtEnergyAmount || "0"),
        },
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "Sold Energy",
          value: parseFloat(soldEnergyAmount || "0"),
        },
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "Peer Output Energy Load",
          value: parseFloat(peerOutputEnergyLoad || "0"),
        },
        {
          interval: intervalIndex,
          prosumer: profile.prosumerId,
          type: "Peer Input Energy Load",
          value: parseFloat(peerInputEnergyLoad || "0"),
        },
      ];
    });
  };

  const chartData = generateChartData();

  // Configuração do gráfico
  const config = {
    data: chartData,
    xField: "interval", // Eixo X com base no número de intervalos
    yField: "value",
    seriesField: "type",  // Cada tipo de dado (e.g., State of Charge, Energy Charge) será uma linha
    xAxis: {
      label: {
        formatter: (val: string) => `Intervalo ${val}`, // Formatar o número do intervalo
      },
    },
    yAxis: {
      title: { text: "Valor (kWh)" },
    },
    tooltip: {
      fields: ["interval", "type", "value"],
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value} kWh`,
      }),
    },
  };

  // Secção Prosumer Profile
  const prosumerProfile = profiles.length > 0 ? profiles[0] : null; // Exemplo de pegar o primeiro perfil

  return (
    <Card title="Análise de Perfis">
      {isLoading ? (
        <p>A carregar...</p>
      ) : (
        <>
          <Row gutter={16}>
            {/* Gráfico de Evolução Temporal dos Perfis */}
            <Col span={24}>
              <Card title="Evolução Temporal dos Perfis">
                <Line {...config} height={400} />
              </Card>
            </Col>
          </Row>

          {/* Secção de Prosumer Profile */}
          {prosumerProfile && (
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={24}>
                <Card title="Perfil do Prosumer">
                  <Descriptions column={2}>
                    <Descriptions.Item label="ID Prosumer">
                      {prosumerProfile.prosumerId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data">
                      {prosumerProfile.date}
                    </Descriptions.Item>
                    <Descriptions.Item label="Intervalo de Tempo">
                      {prosumerProfile.intervalOfTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Estado de Carga">
                      {prosumerProfile.stateOfCharge}
                    </Descriptions.Item>
                    <Descriptions.Item label="Energia Carregada">
                      {prosumerProfile.energyCharge} kWh
                    </Descriptions.Item>
                    <Descriptions.Item label="Energia Descarregada">
                      {prosumerProfile.energyDischarge} kWh
                    </Descriptions.Item>
                    <Descriptions.Item label="Energia Fotovoltaica Carregada">
                      {prosumerProfile.photovoltaicEnergyLoad} kWh
                    </Descriptions.Item>
                    <Descriptions.Item label="Energia Comprada">
                      {prosumerProfile.boughtEnergyAmount} kWh
                    </Descriptions.Item>
                    <Descriptions.Item label="Energia Vendida">
                      {prosumerProfile.soldEnergyAmount} kWh
                    </Descriptions.Item>
                    <Descriptions.Item label="Carga de Perfil">
                      {prosumerProfile.profileLoad} kWh
                    </Descriptions.Item>
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
