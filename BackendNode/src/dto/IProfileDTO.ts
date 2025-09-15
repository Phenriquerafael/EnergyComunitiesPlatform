export default interface IProfileDTO {
  id?: string;
  prosumerId?: string;
  simulationId?: string;
  date?: string;
  intervalOfTime?: number;
  numberOfIntervals?: number;
  stateOfCharge?: number;
  energyCharge?: number;
  energyDischarge?: number;
  photovoltaicEnergyLoad?: number;
  boughtEnergyAmount?: number;
  boughtEnergyPrice?: number;
  soldEnergyAmount?: number;
  soldEnergyPrice?: number;
  peerOutputEnergyLoad?: number;
  peerOutPrice?: number;
  peerInputEnergyLoad?: number;
  peerInPrice?: number;
  profileLoad?: number;
}

export interface ISimulationDTO {
  id?: string;
  startDate: string;
  endDate: string;
  description?: string;
  communityId?: string;
  activeAttributes?: IActiveAtributesDTO[];
}

export interface ISimulationDTO2 {
  id?: string;
  startDate: string;
  endDate: string;
  description?: string;
  communityId?: string;
  communityCountry?: string;
  communityCode?: string;
}

export interface IActiveAtributesDTO {
  prosumerId: string;
  profileLoad: boolean;
  stateOfCharge: boolean;
  photovoltaicEnergyLoad: boolean;
}


export interface ISimulationTotalStats {
  totalLoad: number;
  totalPhotovoltaicEnergyLoad: number;
  totalBoughtEnergy: number;
  totalSoldEnergy: number;
  totalPeerIn: number;
  totalPeerOut: number;
  
}

export interface IMonthlyProfileStatsDTO {
  month: Date;
  averageLoad: number;
  averagePV: number;
  averageBought: number;
  averageSold: number;
  averageSOC: number;
}
