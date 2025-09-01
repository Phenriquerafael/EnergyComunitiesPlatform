import React from 'react';
import { KpiCard } from './KpiCard';
import { ProfileDTO } from '../../interfaces';
import {
  BoltIcon,
  SunIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

interface StatsProps {
  profileData: ProfileDTO[];
}

export const Stats: React.FC<StatsProps> = ({ profileData }) => {
  // Compute totals for the current period (all data)
  const computeTotal = (key: keyof ProfileDTO) =>
    profileData.reduce((sum, item) => sum + parseFloat(item[key] as string), 0);

  // Mock previous period data (for trend calculation)
  // In a real app, fetch previous period data via useList
  const previousPeriodData = profileData.map(item => ({
    ...item,
    profileLoad: (parseFloat(item.profileLoad) * 0.9).toString(), // 10% less
    photovoltaicEnergyLoad: (parseFloat(item.photovoltaicEnergyLoad) * 0.95).toString(),
    boughtEnergyAmount: (parseFloat(item.boughtEnergyAmount) * 1.1).toString(), // 10% more
    soldEnergyAmount: (parseFloat(item.soldEnergyAmount) * 0.85).toString(), // 15% less
  }));

  const computeTrend = (key: keyof ProfileDTO) =>
    previousPeriodData.reduce((sum, item) => sum + parseFloat(item[key] as string), 0);

  const kpis = [
    {
      title: 'Total Profile Load',
      total: computeTotal('profileLoad'),
      trend: computeTrend('profileLoad'),
      icon: <BoltIcon className="w-8 h-8" />,
      colors: { stroke: 'rgb(76, 175, 80)', fill: 'rgba(76, 175, 80, 0.7)' },
      formatTotal: (value: number | string) => `${Number(value).toFixed(1)} kWh`,
    },
    {
      title: 'Photovoltaic Generation',
      total: computeTotal('photovoltaicEnergyLoad'),
      trend: computeTrend('photovoltaicEnergyLoad'),
      icon: <SunIcon className="w-8 h-8" />,
      colors: { stroke: 'rgb(255, 159, 64)', fill: 'rgba(255, 159, 64, 0.7)' },
      formatTotal: (value: number | string) => `${Number(value).toFixed(1)} kWh`,
    },
    {
      title: 'Bought Energy',
      total: computeTotal('boughtEnergyAmount'),
      trend: computeTrend('boughtEnergyAmount'),
      icon: <ArrowDownTrayIcon className="w-8 h-8" />,
      colors: { stroke: 'rgb(54, 162, 235)', fill: 'rgba(54, 162, 235, 0.7)' },
      formatTotal: (value: number | string) => `${Number(value).toFixed(1)} kWh`,
    },
    {
      title: 'Sold Energy',
      total: computeTotal('soldEnergyAmount'),
      trend: computeTrend('soldEnergyAmount'),
      icon: <ArrowUpTrayIcon className="w-8 h-8" />,
      colors: { stroke: 'rgb(153, 102, 255)', fill: 'rgba(153, 102, 255, 0.7)' },
      formatTotal: (value: number | string) => `${Number(value).toFixed(1)} kWh`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {kpis.map((kpi, index) => (
        <KpiCard
          key={index}
          title={kpi.title}
          total={kpi.total}
          trend={kpi.trend}
          icon={kpi.icon}
          colors={kpi.colors}
          formatTotal={kpi.formatTotal}
        />
      ))}
    </div>
  );
};