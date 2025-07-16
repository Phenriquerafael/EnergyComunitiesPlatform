import React, { useState } from 'react';
import { Select } from 'antd';
import { TTab, ProfileDTO } from '../../interfaces';

import { TabView } from '../../components/dashboard/TabView';
import {
  profileData,
  storageEfficiencyData,
  p2pEnergyFlowData,
  communityEnergyData,
  consumptionDistributionData,
  profileClusterData,
  simulations,
} from '../../components/dashboard/mockEnergyData';

import { ResponsiveAreaChart } from '../../components/dashboard/ResponsiveAreaChart';
import { GroupedBarChart } from '../../components/dashboard/GroupedBarChart';
import { StorageEfficiencyRadarChart } from '../../components/dashboard/StorageEfficiencyChart';
import { StackedAreaChart } from '../../components/dashboard/StackedAreaChart';
import { ResponsiveBarChart } from '../../components/dashboard/ResponsiveBarChart';
import { HorizontalBarChart } from '../../components/dashboard/HorizontalBarChart';
import { Histogram } from '../../components/dashboard/Histogram';
import { ScatterPlot } from '../../components/dashboard/ScatterPlot';
import { SankeyDiagram } from '../../components/dashboard/SankeyDiagram';
import { Stats } from '../../components/dashboard/Stats';

import PieChart from '../../components/prosumers/pieChart';
import { RecentSimulations } from '../../components/dashboard/simulations/RecentSimulations';


export const Dashboard: React.FC = () => {
  const [selectedSimulation, setSelectedSimulation] = useState(simulations[0]);

  // Simulação de filtragem de perfis com base na simulação escolhida
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileDTO[]>(profileData); // podes ajustar isto conforme necessário

  const simulationOptions = simulations.map((sim, index) => ({
    label: sim.description,
    value: index,
  }));

  // Estado para o prosumer selecionado (single)
  const [selectedProsumerIndex, setSelectedProsumerIndex] = useState<number | null>(null);
  // Estado para os prosumers selecionados (multiple)
  const [selectedProsumerIndices, setSelectedProsumerIndices] = useState<number[]>([]);

  // Opções para o Select de prosumers
  const prosumerOptions = filteredProfiles.map((prosumer, index) => ({
    label: prosumer.prosumerId || `Prosumer #${index + 1}`,
    value: index,
  }));

  const specificCommunityTabs: TTab[] = [
    {
      id: 1,
      label: 'Battery SoC',
      content: (
        <ResponsiveAreaChart
          kpi="Battery SoC (%)"
          data={profileData}
          dataKey="stateOfCharge"
          colors={{ stroke: 'rgb(54, 162, 235)', fill: 'rgba(54, 162, 235, 0.2)' }}
        />
      ),
    },
    {
      id: 2,
      label: 'Charge/Discharge',
      content: (
        <GroupedBarChart
          kpi="Charge/Discharge (kWh)"
          data={profileData}
          colors={[
            { stroke: 'rgb(54, 162, 235)', fill: 'rgba(54, 162, 235, 0.2)' },
            { stroke: 'rgb(255, 99, 132)', fill: 'rgba(255, 99, 132, 0.2)' },
            { stroke: 'rgb(75, 192, 192)', fill: 'rgba(75, 192, 192, 0.2)' },
            { stroke: 'rgb(255, 159, 64)', fill: 'rgba(255, 159, 64, 0.2)' },
            { stroke: 'rgb(153, 102, 255)', fill: 'rgba(153, 102, 255, 0.2)' },
            { stroke: 'rgb(255, 205, 86)', fill: 'rgba(255, 205, 86, 0.2)' },
          ]}
        />
      ),
    },
    {
      id: 3,
      label: 'Storage Efficiency',
      content: <StorageEfficiencyRadarChart data={storageEfficiencyData} />,
    },
    {
      id: 4,
      label: 'Generation vs Consumption',
      content: (
        <StackedAreaChart
          kpi="Energy (kWh)"
          data={profileData}
          colors={[
            { stroke: 'rgb(54, 162, 235)', fill: 'rgba(54, 162, 235, 0.2)' },
            { stroke: 'rgb(255, 99, 132)', fill: 'rgba(255, 99, 132, 0.2)' },
          ]}
        />
      ),
    },
    {
      id: 5,
      label: 'Profile Load',
      content: (
        <ResponsiveAreaChart
          kpi="Profile Load (kWh)"
          data={profileData}
          dataKey="profileLoad"
          colors={{ stroke: 'rgb(76, 175, 80)', fill: 'rgba(76, 175, 80, 0.2)' }}
        />
      ),
    },
    {
      id: 6,
      label: 'P2P Energy Flows',
      content: <SankeyDiagram data={profileData} />,
    },
    {
      id: 7,
      label: 'P2P Price',
      content: (
        <ResponsiveAreaChart
          kpi="Price ($/kWh)"
          data={profileData}
          dataKey="peerOutPrice"
          colors={{ stroke: 'rgb(153, 102, 255)', fill: 'rgba(153, 102, 255, 0.2)' }}
        />
      ),
    },
    {
      id: 8,
      label: 'Bought vs Sold',
      content: (
        <ResponsiveBarChart
          kpi="Energy (kWh)"
          data={profileData}
          dataKey="boughtEnergyAmount"
          colors={{ stroke: 'rgb(255, 159, 64)', fill: 'rgba(255, 159, 64, 0.7)' }}
        />
      ),
    },
    {
      id: 9,
      label: 'Energy Breakdown (Per Prosumer)',
      content: (
        <div>
          <div className="mb-4 w-full ">
            <Select
              mode="multiple"
              className="ml-5 w-64 "
              placeholder="Choose prosumers"
              options={prosumerOptions}
              value={selectedProsumerIndices}
              onChange={setSelectedProsumerIndices}
              allowClear
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              selectedProsumerIndices.length > 0
              ? selectedProsumerIndices.map(idx => filteredProfiles[idx])
              : filteredProfiles
            ).map((prosumer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-medium mb-2">
                {prosumer.prosumerId || `Prosumer #${selectedProsumerIndices.length > 0 ? selectedProsumerIndices[index] + 1 : index + 1}`}
              </h4>
              <PieChart filteredProfiles={[prosumer]} />
              </div>
            ))}
            </div>
            </div>
        </div>
      ),
    },
  ];

  const allCommunitiesTabs: TTab[] = [
    {
      id: 1,
      label: 'Total Energy Generated',
      content: (
        <HorizontalBarChart
          kpi="Generated Energy (kWh)"
          data={communityEnergyData}
          dataKey="generated"
          colors={{ stroke: 'rgb(54, 162, 235)', fill: 'rgba(54, 162, 235, 0.7)' }}
        />
      ),
    },
    {
      id: 2,
      label: 'Total Energy Traded',
      content: (
        <HorizontalBarChart
          kpi="Traded Energy (kWh)"
          data={communityEnergyData}
          dataKey="traded"
          colors={{ stroke: 'rgb(255, 159, 64)', fill: 'rgba(255, 159, 64, 0.7)' }}
        />
      ),
    },
    {
      id: 3,
      label: 'Consumption Distribution',
      content: (
        <Histogram
          kpi="Number of Intervals"
          data={consumptionDistributionData}
          colors={{ stroke: 'rgb(76, 175, 80)', fill: 'rgba(76, 175, 80, 0.7)' }}
        />
      ),
    },
    {
      id: 4,
      label: 'Profile Clustering',
      content: (
        <ScatterPlot
          kpi="Profile Clusters"
          data={profileClusterData}
          colors={{ stroke: 'rgb(153, 102, 255)', fill: 'rgba(153, 102, 255, 0.7)' }}
        />
      ),
    },
    //Buscar profiles por comunidade
/*     {
      id: 5,
      label: 'Community Breakdown (Pie)',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityEnergyData.map((community, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-medium mb-2">Community #{index + 1}</h4>
              <PieChart filteredProfiles={[community]} />
            </div>
          ))}
        </div>
      ),
    }, */
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Energy Community Dashboard</h1>
      <Stats profileData={profileData} />
      <div className="mb-6">
        <label className="block text-md font-medium mb-2">Select Simulation</label>
        <Select
          className="w-full md:w-1/2"
          placeholder="Choose a simulation"
          options={simulationOptions}
          value={simulations.indexOf(selectedSimulation)}
          onChange={(value) => {
            setSelectedSimulation(simulations[value]);
            // Atualizar os perfis com base na simulação selecionada
            setFilteredProfiles(profileData); // você pode aplicar filtros reais aqui
          }}
        />
        <p className="text-sm text-gray-500 mt-2">
          Selected period: {selectedSimulation.startDate} to {selectedSimulation.endDate}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Specific Community</h2>
      <TabView tabs={specificCommunityTabs} />
      <h2 className="text-xl font-semibold mb-2 mt-8">All Communities</h2>
      <TabView tabs={allCommunitiesTabs} />
      <br />
      <h2 className="text-xl font-semibold mb-2">Recent Simulations</h2>
      <RecentSimulations /* data={simulations} */ />
      <br />

    </div>
  );
};
