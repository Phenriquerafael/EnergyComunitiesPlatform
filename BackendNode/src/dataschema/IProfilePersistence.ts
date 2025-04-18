import { Prosumer as PrismaProsumer } from "@prisma/client";

export default interface IProfilePersistence {
  id: string;
  prosumerId: string;
  prosumer?: PrismaProsumer; // Usar o tipo do Prisma para prosumer
  intervalOfTime: string;
  numberOfIntervals: number;
  stateOfCharge: string;
  photovoltaicEnergyLoad: string;
  boughtEnergyAmount: string;
  boughtEnergyPrice: string;
  soldEnergyAmount: string;
  soldEnergyPrice: string;
  profileLoad: string;
  
}