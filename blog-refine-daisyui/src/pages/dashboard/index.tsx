import React, { useMemo } from 'react';
import { TTab } from '../../interfaces';

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

import { useState } from 'react';
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
import { RecentSimulations } from '../../components/dashboard/RecentSimulations';
import { Select } from "antd";

export const Dashboard: React.FC = () => {
  const [selectedSimulation, setSelectedSimulation] = useState(simulations[0]);

const simulationOptions = simulations.map((sim, index) => ({
  label: sim.description,
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
            onChange={(value) => setSelectedSimulation(simulations[value])}
          />
          <p className="text-sm text-gray-500 mt-2">
            Selected period: {selectedSimulation.startDate} to {selectedSimulation.endDate}
          </p>
        </div>

      <h2 className="text-xl font-semibold mb-2">Specific Community</h2>
      <TabView tabs={specificCommunityTabs} />
      <h2 className="text-xl font-semibold mb-2 mt-8">All Communities</h2>
      <TabView tabs={allCommunitiesTabs} />
      <RecentSimulations data= {simulations}/>
    </div>
  );
};