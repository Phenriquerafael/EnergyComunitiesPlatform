import { Card, Select } from 'antd';
import React, { useState } from 'react';
import { Pie } from '@ant-design/plots';
import { ProfileDTO } from '../../interfaces';

interface PieChartProps {
  filteredProfiles: ProfileDTO[];
}

const variableSets = [
  {
    key: 'external_transactions',
    label: 'External Transactions',
    fields: [
      { key: 'peerInputEnergyLoad', label: 'Peer Input Energy' },
      { key: 'peerOutputEnergyLoad', label: 'Peer Output Energy' },
      { key: 'boughtEnergyAmount', label: 'Bought Energy' },
      { key: 'soldEnergyAmount', label: 'Sold Energy' },
    ],
  },
  {
    key: 'battery_charge_discharge',
    label: 'Battery Charge/Discharge',
    fields: [
      { key: 'energyCharge', label: 'Energy Charge' },
      { key: 'energyDischarge', label: 'Energy Discharge' },
    ],
  },
  {
    key: 'generation_vs_consumption',
    label: 'Generation vs Consumption',
    fields: [
      { key: 'photovoltaicEnergyLoad', label: 'Photovoltaic Generation' },
      { key: 'profileLoad', label: 'Profile Load' },
    ],
  },
  {
    key: 'p2p_trading_prices',
    label: 'P2P Trading Prices',
    fields: [
      { key: 'peerInPrice', label: 'Peer Input Price' },
      { key: 'peerOutPrice', label: 'Peer Output Price' },
    ],
  },
  {
    key: 'all_energy_distribution',
    label: 'All Energy Distribution',
    fields: [
      { key: 'peerInputEnergyLoad', label: 'Peer Input Energy' },
      { key: 'peerOutputEnergyLoad', label: 'Peer Output Energy' },
      { key: 'boughtEnergyAmount', label: 'Bought Energy' },
      { key: 'soldEnergyAmount', label: 'Sold Energy' },
      { key: 'energyCharge', label: 'Battery Charge' },
      { key: 'energyDischarge', label: 'Battery Discharge' },
      { key: 'photovoltaicEnergyLoad', label: 'Photovoltaic Generation' },
      { key: 'profileLoad', label: 'Profile Load' },
    ],
  },
];

const PieChart: React.FC<PieChartProps> = ({ filteredProfiles }) => {
  const [chartType, setChartType] = useState<string>(variableSets[0].key);

  const selectedSet = variableSets.find((set) => set.key === chartType);
  const averageFields = selectedSet ? selectedSet.fields : [];

  const generatePieChartData = () => {
    return averageFields
      .map((f) => {
        const total = filteredProfiles.reduce((sum, profile) => {
          const value = profile[f.key as keyof ProfileDTO];
          return sum + (value ? Number(value) : 0);
        }, 0);
        return { type: f.label, value: Number(total.toFixed(2)) };
      })
      .filter((d) => d.value > 0);
  };

  const pieChartData = generatePieChartData();

  const totalValue = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal =
    totalValue >= 1_000_000 ? totalValue.toExponential(2) : totalValue.toFixed(2);

  const pieConfig = {
    data: pieChartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8, // diminui o tamanho do gráfico
    innerRadius: 0, // remove o "donut", e assim o valor no centro
    label: {
      type: 'spider',
      labelHeight: 24,
      content:
        chartType === 'p2p_trading_prices'
          ? '{name}\n${value}/kWh'
          : '{name}\n{value} kWh',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div className="p-4 bg-zinc-50 border rounded-lg w-full  mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Optimized Energy Distribution</h3>
        <Select
          value={chartType}
          onChange={setChartType}
          className="w-56"
          options={variableSets.map((set) => ({
            value: set.key,
            label: set.label,
          }))}
        />
      </div>

      {pieChartData.length === 0 ? (
        <p className="text-center text-gray-500">No data available for the selected chart type.</p>
      ) : (
        <>
          {chartType !== 'p2p_trading_prices' && (
            <p className="text-right mb-2 text-sm text-gray-600 font-medium">
              Total Energy: {formattedTotal} kWh
            </p>
          )}
          <Pie {...pieConfig} height={300} />
        </>
      )}
    </div>
  );
};

export default PieChart;
