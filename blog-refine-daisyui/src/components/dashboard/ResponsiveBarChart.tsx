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
import { ProfileDTO } from '../../interfaces';

interface ResponsiveBarChartProps {
  kpi: string;
  data: ProfileDTO[] | any[];
  colors: { stroke: string; fill: string } | { stroke: string; fill: string }[];
  dataKey: string;
}

export const ResponsiveBarChart: React.FC<ResponsiveBarChartProps> = ({
  kpi,
  data,
  colors,
  dataKey,
}) => {
  const color = Array.isArray(colors) ? colors[0] : colors;
  const formattedData = data.map(item => ({
    ...item,
    date: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    }).format(new Date(item.date)),
    value: parseFloat(item[dataKey as keyof ProfileDTO] as string),
  }));

  return (
    <ResponsiveContainer height={400}>
      <BarChart
        data={formattedData}
        width={1200}
        height={400}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="0 0" />
        <XAxis
          dataKey="date"
          tickCount={formattedData?.length ?? 0}
          tick={{ stroke: 'light-grey', strokeWidth: 0.5, fontSize: '12px' }}
        />
        <YAxis
          domain={[0, 'dataMax']}
          tickCount={13}
          tick={{ stroke: 'light-grey', strokeWidth: 0.5, fontSize: '12px' }}
        />
        <Tooltip
          content={<ChartTooltip colors={color} kpi={kpi} />}
          wrapperStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '0 solid #000',
            borderRadius: '10px',
          }}
        />
        <Bar
          type="monotone"
          dataKey="value"
          stroke={color?.stroke}
          strokeWidth={1}
          fill={color?.fill}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};