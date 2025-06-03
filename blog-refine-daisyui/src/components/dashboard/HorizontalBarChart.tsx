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
import { ICommunityEnergy } from '../../interfaces';

interface HorizontalBarChartProps {
  kpi: string;
  data: ICommunityEnergy[];
  dataKey: string;
  colors: { stroke: string; fill: string };
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  kpi,
  data,
  dataKey,
  colors,
}) => {
  return (
    <ResponsiveContainer height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="0 0" />
        <XAxis type="number" domain={[0, 'dataMax']} />
        <YAxis dataKey="community" type="category" />
        <Tooltip
          content={<ChartTooltip kpi={kpi} colors={colors} />}
          wrapperStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '0 solid #000',
            borderRadius: '10px',
          }}
        />
        <Bar dataKey={dataKey} fill={colors.fill} stroke={colors.stroke} />
      </BarChart>
    </ResponsiveContainer>
  );
};