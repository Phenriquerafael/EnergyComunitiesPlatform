import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { IStorageEfficiency } from '../../interfaces';

interface StorageEfficiencyRadarChartProps {
  data: IStorageEfficiency[];
}

export const StorageEfficiencyRadarChart: React.FC<StorageEfficiencyRadarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="prosumer" />
        <PolarRadiusAxis domain={[0, 100]} />
        <Radar
          name="Efficiency"
          dataKey="efficiency"
          stroke="rgb(76, 175, 80)"
          fill="rgba(76, 175, 80, 0.2)"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};