export default interface IProfileDTO {
    id?: string;
    prosumerId?: string;
    simulation?: ISimulationDTO;
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
    community?: {
        id: string;
        name?: string;
    };
    profileLoad: boolean;
    stateOfCharge: boolean;
    photovoltaicEnergyLoad: boolean;
}