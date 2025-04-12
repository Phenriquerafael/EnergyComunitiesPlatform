export default interface IProfileDTO {
    id?: string;
    timeStampUnit: string;
    timeStampIntervalNumber: number;
    stateOfCharge: string;
    photovoltaicEnergyLoad: string;
    boughtEnergyAmount: string;
    boutghtEnergyPrice: string;
    soldEnergyAmount: string;
    soldEnergyPrice: string;
    profileLoad: string;
}