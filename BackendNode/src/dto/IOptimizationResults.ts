export default interface IOptimizationResults {
    total_objective_value: string;
    start_date: string;
    end_date: string;
    description?: string;
    communityId?: string;
    active_attributes?: {
        prosumerId: string;
        profileLoad: boolean;
        stateOfCharge: boolean;
        photovoltaicEnergyLoad: boolean;
    }[];

    detailed_results:
        {
            DateTime: string;
            Time_Step: number;
            Prosumer: string;
            P_buy: number;
            P_sell: number;
            SOC: number;
            P_ESS_ch: number;
            P_ESS_dch: number;
            P_PV_load: number;
            P_PV_ESS: number;
            P_Peer_out: number;
            P_Peer_in: number;
            P_Load: number;
        }[];

}