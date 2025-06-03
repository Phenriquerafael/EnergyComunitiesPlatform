import React from 'react';
import { ProfileDTO } from '../../interfaces';

interface SankeyDiagramProps {
  data: ProfileDTO[];
}

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ data }) => {
  const flows = data
    .filter(item => parseFloat(item.peerOutputEnergyLoad) > 0)
    .map(item => ({
      source: item.prosumerId,
      target: 'Other Prosumer', // Simplified, as target prosumer not specified
      value: parseFloat(item.peerOutputEnergyLoad),
    }));

  return (
    <div className="h-[400px] bg-slate-50 border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">P2P Energy Flows</h3>
      <svg width="100%" height="350">
        {flows.map((link, index) => (
          <g key={index}>
            <line
              x1="100"
              y1={50 + index * 50}
              x2="300"
              y2={50 + (index + 1) * 50}
              stroke="rgb(54, 162, 235)"
              strokeWidth={link.value}
            />
            <text x="50" y={50 + index * 50} fontSize="12">
              {link.source}
            </text>
            <text x="350" y={50 + (index + 1) * 50} fontSize="12">
              {link.target}
            </text>
            <text x="200" y={50 + index * 50 + 25} fontSize="12" fill="black">
              {link.value} kWh
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};