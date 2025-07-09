export default interface IOptimizationResults {
    total_objective_value: string;
    start_date: string;
    end_date: string;
    description?: string;
    detailed_results:
        {
            DateTime: string;
            Time_Step: string;
            Prosumer: string;
            P_buy: string;
            P_sell: string;
            SOC: string;
            P_ESS_ch: string;
            P_ESS_dch: string;
            P_PV_load: string;
            P_PV_ESS: string;
            P_Peer_out: string;
            P_Peer_in: string;
            P_Load: string;
        }[];

}