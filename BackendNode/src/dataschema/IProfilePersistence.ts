import { Community, Prosumer as PrismaProsumer, Simulation } from "@prisma/client";
import { User as PrismaUser } from "@prisma/client";
import { Battery as PrismaBattery } from "@prisma/client";

export default interface IProfilePersistence {
  id: string;
  date: string;
  prosumerId: string;
  prosumer?: PrismaProsumer & { user?: PrismaUser; battery?: PrismaBattery }; // Include user and battery
  simulation: Simulation;
  intervalOfTime: number;
  numberOfIntervals: number;
  stateOfCharge: number;
  batteryCharge: number;
  batteryDischarge: number;
  peerOutputEnergyLoad: number;
  peerOutPrice: number;
  peerInputEnergyLoad: number;
  peerInPrice: number;
  photovoltaicEnergyLoad: number;
  boughtEnergyAmount: number;
  boughtEnergyPrice: number;
  soldEnergyAmount: number;
  soldEnergyPrice: number;
  profileLoad: number;

}

export interface ISimulationPersistence {
  id: string;
  startDate: string;
  endDate: string;
  description?: string;
  communityId: string;
  community: Community;
  activeAttributes?: {
    prosumerId: string;
    profileLoad: boolean;
    stateOfCharge: boolean;
    photovoltaicEnergyLoad: boolean;
  }[];
}

