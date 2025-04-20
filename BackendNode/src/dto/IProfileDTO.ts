export default interface IProfileDTO {
    id?: string;
    prosumerId?: string;
    intervalOfTime?: string;
    numberOfIntervals?: number;
    stateOfCharge?: string;
    photovoltaicEnergyLoad?: string;
    boughtEnergyAmount?: string;
    boughtEnergyPrice?: string;
    soldEnergyAmount?: string;
    soldEnergyPrice?: string;
    profileLoad?: string;

}