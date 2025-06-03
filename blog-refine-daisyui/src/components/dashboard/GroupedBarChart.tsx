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

interface GroupedBarChartProps {
  kpi: string;
  data: ProfileDTO[];
  colors: { stroke: string; fill: string }[];
}

export const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  kpi,
  data,
  colors,
}) => {
  const formattedData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing[`${item.prosumerId}_charge`] = parseFloat(item.energyCharge);
      existing[`${item.prosumerId}_discharge`] = parseFloat(item.energyDischarge);
    } else {
      acc.push({
        date: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          year: 'numeric',
          day: 'numeric',
        }).format(new Date(item.date)),
        [`${item.prosumerId}_charge`]: parseFloat(item.energyCharge),
        [`${item.prosumerId}_discharge`]: parseFloat(item.energyDischarge),
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <ResponsiveContainer height={400}>
      <BarChart
        data={formattedData}
        margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
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
          content={<ChartTooltip kpi={kpi} colors={colors[0]} />}
          wrapperStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '0 solid #000',
            borderRadius: '10px',
          }}
        />
        <Bar dataKey="prosumer1_charge" fill={colors[0].fill} stroke={colors[0].stroke} name="Prosumer 1 Charge" />
        <Bar dataKey="prosumer1_discharge" fill={colors[1].fill} stroke={colors[1].stroke} name="Prosumer 1 Discharge" />
        <Bar dataKey="prosumer2_charge" fill={colors[2].fill} stroke={colors[2].stroke} name="Prosumer 2 Charge" />
        <Bar dataKey="prosumer2_discharge" fill={colors[3].fill} stroke={colors[3].stroke} name="Prosumer 2 Discharge" />
        <Bar dataKey="prosumer3_charge" fill={colors[4].fill} stroke={colors[4].stroke} name="Prosumer 3 Charge" />
        <Bar dataKey="prosumer3_discharge" fill={colors[5].fill} stroke={colors[5].stroke} name="Prosumer 3 Discharge" />
      </BarChart>
    </ResponsiveContainer>
  );
};