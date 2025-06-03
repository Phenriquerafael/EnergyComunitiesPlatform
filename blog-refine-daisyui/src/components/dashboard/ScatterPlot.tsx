import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { IProfileCluster } from '../../interfaces';

interface ScatterPlotProps {
  kpi: string;
  data: IProfileCluster[];
  colors: { stroke: string; fill: string };
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ kpi, data, colors }) => {
  return (
    <ResponsiveContainer height={400}>
      <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="X" domain={[-3, 3]} />
        <YAxis type="number" dataKey="y" name="Y" domain={[-3, 3]} />
        <Tooltip
          content={<ChartTooltip kpi={kpi} colors={colors} />}
          wrapperStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '0 solid #000',
            borderRadius: '10px',
          }}
        />
        <Scatter name="Profiles" data={data} fill={colors.fill} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};