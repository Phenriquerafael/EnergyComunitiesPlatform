import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { IConsumptionDistribution } from '../../interfaces';

interface HistogramProps {
  kpi: string;
  data: IConsumptionDistribution[];
  colors: { stroke: string; fill: string };
}

export const Histogram: React.FC<HistogramProps> = ({ kpi, data, colors }) => {
  return (
    <ResponsiveContainer height={400}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="0 0" />
        <XAxis dataKey="intervals" />
        <YAxis />
        <Tooltip
          content={<ChartTooltip kpi={kpi} colors={colors} />}
          wrapperStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '0 solid #000',
            borderRadius: '10px',
          }}
        />
        <Bar dataKey="count" fill={colors.fill} stroke={colors.stroke} />
      </BarChart>
    </ResponsiveContainer>
  );
};