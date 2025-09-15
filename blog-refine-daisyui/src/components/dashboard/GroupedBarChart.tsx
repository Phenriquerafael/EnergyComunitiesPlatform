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
        {data.length > 0 &&
          Object.keys(data.reduce((acc, item) => {
            acc[item.prosumerId] = true;
            return acc;
          }, {} as Record<string, boolean>)).map((prosumerId, index) => (
            <React.Fragment key={prosumerId}>
              <Bar
                dataKey={`${prosumerId}_charge`}
                stackId="a"
                fill={colors[index % colors.length].fill}
                stroke={colors[index % colors.length].stroke}
                barSize={20}
                name={`Prosumer ${prosumerId} Charge`}
              />
              <Bar
                dataKey={`${prosumerId}_discharge`}
                stackId="a"
                fill={colors[(index + 1) % colors.length].fill}
                stroke={colors[(index + 1) % colors.length].stroke}
                barSize={20}
                name={`Prosumer ${prosumerId} Discharge`}
              />
            </React.Fragment>
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
};