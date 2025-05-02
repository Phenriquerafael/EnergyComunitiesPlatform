export interface ProfileDTO {
    id?: string;
    prosumerId: string;
    date: string;
    intervalOfTime: string;
    numberOfIntervals: number;
    stateOfCharge: string;
    energyCharge: string;
    energyDischarge: string;
    photovoltaicEnergyLoad: string;
    boughtEnergyAmount: string;
    boughtEnergyPrice?: string;
    soldEnergyAmount: string;
    soldEnergyPrice?: string;
    peerOutputEnergyLoad: string;
    peerOutPrice?: string;
    peerInputEnergyLoad: string;
    peerInPrice?: string;
    profileLoad: string;
  }

  export interface OptimizationResult {
    Day: string;
    Time_Step: number;
    Prosumer: string;
    P_buy: string;
    P_sell: string;
    SOC: string;
    P_ESS_ch: string;
    P_ESS_dch: string;
    P_PV_load: string;
    P_Peer_out: string;
    P_Peer_in: string;
    P_Load: string;
  }
  
  export interface OptimizeRequest {
    total_objective_value?: string;
    detailed_results: OptimizationResult[];
  }
  