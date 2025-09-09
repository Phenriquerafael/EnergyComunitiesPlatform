import React, { useState, useEffect, useMemo } from "react";
import { Select } from "antd";
import { TTab, ProfileDTO, ISimulationDTO2, ISimulationTotalStats } from "../../interfaces";

import { TabView } from "../../components/dashboard/TabView";
import {
  storageEfficiencyData,
  p2pEnergyFlowData,
  communityEnergyData,
  consumptionDistributionData,
  profileClusterData,
  profileData,
} from "../../components/dashboard/mockEnergyData";
import { useList,useOne } from "@refinedev/core";
import { ResponsiveAreaChart } from "../../components/dashboard/ResponsiveAreaChart";
import { GroupedBarChart } from "../../components/dashboard/GroupedBarChart";
import { StorageEfficiencyRadarChart } from "../../components/dashboard/StorageEfficiencyChart";
import { StackedAreaChart } from "../../components/dashboard/StackedAreaChart";
import { ResponsiveBarChart } from "../../components/dashboard/ResponsiveBarChart";
import { HorizontalBarChart } from "../../components/dashboard/HorizontalBarChart";
import { Histogram } from "../../components/dashboard/Histogram";
import { ScatterPlot } from "../../components/dashboard/ScatterPlot";
import { SankeyDiagram } from "../../components/dashboard/SankeyDiagram";
import { Stats } from "../../components/dashboard/Stats";
import PieChart from "../../components/prosumers/pieChart";
import { RecentSimulations } from "../../components/dashboard/simulations/RecentSimulations";
import { id } from "date-fns/locale";

// Hook para buscar simulações
const useSimulations = () => {
  const { data } = useList<ISimulationDTO2>({
    resource: "simulations/all2",
  });
  return data?.data ?? [];
};

// Hook para buscar dados totais da simulação selecionada
const useSimulationStats = (id?: string) => {
  const { data, isLoading } = useOne<ISimulationTotalStats>({
    resource: "profiles/simulationStats",
    id: id ?? "", // passa o id aqui
    queryOptions: {
      enabled: !!id, // só faz a query se tiver id
    },
  });

  return {
    stats: data?.data ?? undefined,
    isLoading,
  };
};


// Hook para buscar perfis da comunidade
const useCommunityProfiles = (communityId?: string) => {
  const { data, isLoading } = useList<ProfileDTO>({
    resource: communityId ? `profiles/community/${communityId}` : "",
    queryOptions: {
      enabled: !!communityId,
    },
  });
  return { profiles: data?.data ?? [], isLoading };
};

export const Dashboard: React.FC = () => {
  // 1. Buscar todas as simulações
  const simulations = useSimulations();

  // 2. Estado da simulação selecionada
  const [selectedSimulation, setSelectedSimulation] = useState<ISimulationDTO2 | null>(
      null
  );

  // 3. Buscar profiles da simulação selecionada
/*   const { profiles: communityProfiles, isLoading: isProfilesLoading } =
    useCommunityProfiles(selectedSimulation?.communityId); */

  // 3. Buscar dados totais da simulação selecionada

  const { stats: simulationStats, isLoading: isStatsLoading } =
    useSimulationStats(selectedSimulation?.id);


  // 4. Alterar simulação
  const handleSimulationChange = (simulationId: string) => {
    const sim = simulations.find((s) => s.id === simulationId);
    setSelectedSimulation(sim || null);
  };

  // 5. Prosumer selecionado
  const [selectedProsumerIndices, setSelectedProsumerIndices] = useState<number[]>([]);

  // Opções de prosumers
  const prosumerOptions = useMemo(
    () =>
      profileData.map((prosumer, index) => ({
        label: prosumer.prosumerId || `Prosumer #${index + 1}`,
        value: index,
      })),
    [profileData]
  );



  // Tabs da comunidade específica
  const specificCommunityTabs: TTab[] = [
    {
      id: 1,
      label: "Battery SoC",
      content: (
        <ResponsiveAreaChart
          kpi="Battery SoC (%)"
          data={profileData}
          dataKey="stateOfCharge"
          colors={{ stroke: "rgb(54,162,235)", fill: "rgba(54,162,235,0.2)" }}
        />
      ),
    },
    {
      id: 2,
      label: "Charge/Discharge",
      content: (
        <GroupedBarChart
          kpi="Charge/Discharge (kWh)"
          data={profileData}
          colors={[
            { stroke: "rgb(54,162,235)", fill: "rgba(54,162,235,0.2)" },
            { stroke: "rgb(255,99,132)", fill: "rgba(255,99,132,0.2)" },
          ]}
        />
      ),
    },
    {
      id: 3,
      label: "Storage Efficiency",
      content: <StorageEfficiencyRadarChart data={storageEfficiencyData} />,
    },
    {
      id: 4,
      label: "Generation vs Consumption",
      content: (
        <StackedAreaChart
          kpi="Energy (kWh)"
          data={profileData}
          colors={[
            { stroke: "rgb(54,162,235)", fill: "rgba(54,162,235,0.2)" },
            { stroke: "rgb(255,99,132)", fill: "rgba(255,99,132,0.2)" },
          ]}
        />
      ),
    },
    {
      id: 5,
      label: "Profile Load",
      content: (
        <ResponsiveAreaChart
          kpi="Profile Load (kWh)"
          data={profileData}
          dataKey="profileLoad"
          colors={{ stroke: "rgb(76,175,80)", fill: "rgba(76,175,80,0.2)" }}
        />
      ),
    },
    {
      id: 6,
      label: "P2P Energy Flows",
      content: <SankeyDiagram data={profileData} />,
    },
    {
      id: 7,
      label: "Energy Breakdown (Per Prosumer)",
      content: (
        <div className="mb-4 w-full">
          <Select
            mode="multiple"
            className="ml-5 w-64"
            placeholder="Choose prosumers"
            options={prosumerOptions}
            value={selectedProsumerIndices}
            onChange={setSelectedProsumerIndices}
            allowClear
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {(selectedProsumerIndices.length > 0
              ? selectedProsumerIndices.map((idx) => profileData[idx])
              : profileData
            ).map((prosumer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="font-medium mb-2">
                  {prosumer.prosumerId || `Prosumer #${index + 1}`}
                </h4>
                <PieChart filteredProfiles={[prosumer]} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const allCommunitiesTabs: TTab[] = [
    {
      id: 1,
      label: "Total Energy Generated",
      content: (
        <HorizontalBarChart
          kpi="Generated Energy (kWh)"
          data={communityEnergyData}
          dataKey="generated"
          colors={{ stroke: "rgb(54,162,235)", fill: "rgba(54,162,235,0.7)" }}
        />
      ),
    },
    {
      id: 2,
      label: "Consumption Distribution",
      content: (
        <Histogram
          kpi="Number of Intervals"
          data={consumptionDistributionData}
          colors={{ stroke: "rgb(76,175,80)", fill: "rgba(76,175,80,0.7)" }}
        />
      ),
    },
    {
      id: 3,
      label: "Profile Clustering",
      content: (
        <ScatterPlot
          kpi="Profile Clusters"
          data={profileClusterData}
          colors={{ stroke: "rgb(153,102,255)", fill: "rgba(153,102,255,0.7)" }}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Energy Community Dashboard</h1>

      {selectedSimulation && isStatsLoading && <div className="loading loading-dots">Loading stats...</div>}

      {simulationStats && <Stats stats={simulationStats} />}

      <div className="mb-6">
        <label className="block text-md font-medium mb-2">Select Simulation</label>
        <Select
          className="w-full"
          placeholder="Choose a simulation"
          options={simulations.map((sim, index) => ({
            label: (
              <div style={{ display: "flex", gap: 16 }}>
                <strong>{sim.description}</strong>
                <span style={{ fontSize: 12, color: "#888" }}>
                  {sim.startDate} - {sim.endDate}
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>
                  Country: {sim.communityCountry}
                </span>
              </div>
            ),
            value: sim.id,
            key: index,
          }))}
          value={selectedSimulation?.id}
          onChange={(value) => handleSimulationChange(value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Specific Community</h2>
      <TabView tabs={specificCommunityTabs} />

      <h2 className="text-xl font-semibold mb-2 mt-8">All Communities</h2>
      <TabView tabs={allCommunitiesTabs} />

      <br />
      <h2 className="text-xl font-semibold mb-2">Recent Simulations</h2>
      <RecentSimulations />
      <br />
    </div>
  );
};
