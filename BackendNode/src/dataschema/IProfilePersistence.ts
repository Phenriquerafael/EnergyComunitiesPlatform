import { Prosumer as PrismaProsumer } from "@prisma/client";
import { User as PrismaUser } from "@prisma/client";
import { Battery as PrismaBattery } from "@prisma/client";

export default interface IProfilePersistence {
  id: string;
  date: string;
  prosumerId: string;
  prosumer?: PrismaProsumer & { user?: PrismaUser; battery?: PrismaBattery }; // Include user and battery
  intervalOfTime: string;
  numberOfIntervals: number;
  stateOfCharge: string;
  batteryCharge: string;
  batteryDischarge: string;
  peerOutputEnergyLoad: string;
  peerOutPrice: string;
  peerInputEnergyLoad: string;
  peerInPrice: string;
  photovoltaicEnergyLoad: string;
  boughtEnergyAmount: string;
  boughtEnergyPrice: string;
  soldEnergyAmount: string;
  soldEnergyPrice: string;
  profileLoad: string;
  
}