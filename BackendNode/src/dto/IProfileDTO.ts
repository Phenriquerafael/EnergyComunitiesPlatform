export default interface IProfileDTO {
  id?: string;
  prosumerId?: string;
  simulationId?: string;
  date?: string;
  intervalOfTime?: string;
  numberOfIntervals?: number;
  stateOfCharge?: string;
  energyCharge?: string;
  energyDischarge?: string;
  photovoltaicEnergyLoad?: string;
  boughtEnergyAmount?: string;
  boughtEnergyPrice?: string;
  soldEnergyAmount?: string;
  soldEnergyPrice?: string;
  peerOutputEnergyLoad?: string;
  peerOutPrice?: string;
  peerInputEnergyLoad?: string;
  peerInPrice?: string;
  profileLoad?: string;
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