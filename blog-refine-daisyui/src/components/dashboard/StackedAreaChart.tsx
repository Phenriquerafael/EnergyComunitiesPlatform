import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { ProfileDTO } from '../../interfaces';

interface StackedAreaChartProps {
  kpi: string;
  data: ProfileDTO[];
  colors: { stroke: string; fill: string }[];
}

export const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  kpi,
  data,
  colors,
}) => {
  const formattedData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing.generated += parseFloat(item.photovoltaicEnergyLoad);
      existing.consumed += parseFloat(item.profileLoad);
    } else {
      acc.push({
        date: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          year: 'numeric',
          day: 'numeric',
        }).format(new Date(item.date)),
        generated: parseFloat(item.photovoltaicEnergyLoad),
        consumed: parseFloat(item.profileLoad),
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <ResponsiveContainer height={400}>
      <AreaChart
        data={formattedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="0 0 0" />
        <XAxis
          dataKey="date"
          tickCount={formattedData?.length ?? 0}
          tick={{ stroke: 'light-grey', strokeWidth: 0.5, fontSize: '12px' }}
        />
        <YAxis
          tickCount={13}
          tick={{ stroke: 'light-grey', strokeWidth: 0.5, fontSize: '12px' }}
          interval="preserveStartEnd"
          domain={[0, 'dataMax + 10']}
        />
        <Tooltip
          content={<ChartTooltip kpi={kpi} colors={colors[0]} />}
          wrapperStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '0 solid #000',
            borderRadius: '10px',
          }}
        />
        <Area
          type="monotone"
          dataKey="generated"
          stackId="1"
          stroke={colors[0].stroke}
          fill={colors[0].fill}
        />
        <Area
          type="monotone"
          dataKey="consumed"
          stackId="1"
          stroke={colors[1].stroke}
          fill={colors[1].fill}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};