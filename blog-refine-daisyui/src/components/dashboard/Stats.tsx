import React from "react";
import { KpiCard } from "./KpiCard";
import { ISimulationTotalStats } from "../../interfaces";
import {
  BoltIcon,
  SunIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

interface StatsProps {
  stats: ISimulationTotalStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  // Mock previous period stats (podes trocar isto por dados reais no futuro)
  const previousStats: ISimulationTotalStats = {
    totalLoad: stats.totalLoad * 0.9,
    totalPhotovoltaicEnergyLoad: stats.totalPhotovoltaicEnergyLoad * 0.95,
    totalBoughtEnergy: stats.totalBoughtEnergy * 1.1,
    totalSoldEnergy: stats.totalSoldEnergy * 0.85,
    totalPeerIn: stats.totalPeerIn * 1.05,
    totalPeerOut: stats.totalPeerOut * 0.92,
  };

  const kpis = [
    {
      title: "Total Profile Load",
      total: stats.totalLoad,
      trend: previousStats.totalLoad,
      icon: <BoltIcon className="w-8 h-8" />,
      colors: { stroke: "rgb(76, 175, 80)", fill: "rgba(76, 175, 80, 0.7)" },
      formatTotal: (value: number | string) => `${typeof value === "number" ? value.toFixed(1) : Number(value).toFixed(1)} kWh`,
    },
    {
      title: "Photovoltaic Generation",
      total: stats.totalPhotovoltaicEnergyLoad,
      trend: previousStats.totalPhotovoltaicEnergyLoad,
      icon: <SunIcon className="w-8 h-8" />,
      colors: { stroke: "rgb(255, 159, 64)", fill: "rgba(255, 159, 64, 0.7)" },
     formatTotal: (value: number | string) => `${Number(value).toFixed(1)} kWh`,
    },
    {
      title: "Bought Energy",
      total: stats.totalBoughtEnergy,
      trend: previousStats.totalBoughtEnergy,
      icon: <ArrowDownTrayIcon className="w-8 h-8" />,
      colors: { stroke: "rgb(54, 162, 235)", fill: "rgba(54, 162, 235, 0.7)" },
      formatTotal: (value: number | string) => `${Number(value).toFixed(1)} kWh`,
    },
    {
      title: "Sold Energy",
      total: stats.totalSoldEnergy,
      trend: previousStats.totalSoldEnergy,
      icon: <ArrowUpTrayIcon className="w-8 h-8" />,
      colors: { stroke: "rgb(153, 102, 255)", fill: "rgba(153, 102, 255, 0.7)" },
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
