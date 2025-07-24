import React from 'react';
import { Pie } from '@ant-design/plots';

const SimplePieChart: React.FC = () => {
  // Mock de dados (kWh)
  const pieChartData = [
    { type: 'Profile Load', value: 516.19 },
    { type: 'Photovoltaic Generation', value: 318.6 },
    { type: 'Bought Energy', value: 197.59},
  ];

  const totalValue = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = totalValue >= 1_000_000
    ? totalValue.toExponential(2)
    : totalValue.toFixed(2);

  const pieConfig = {
    data: pieChartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0,
    label: {
      type: 'spider',
      labelHeight: 24,
      content: '{name}\n{value} kWh',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div className="p-4 bg-white border rounded-lg w-full  mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Individual Energy Distribution</h3>
      </div>

      <p className="text-right mb-2 text-sm text-gray-600 font-medium">
        Total Energy: {formattedTotal} kWh
      </p>

      <Pie {...pieConfig} height={300} />
    </div>
  );
};

export default SimplePieChart;
