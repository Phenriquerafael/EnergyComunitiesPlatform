import IProfilePersistence from '../dataschema/IProfilePersistence';
import { Profile } from '../domain/Profile/Profile';
import { TimeStamp } from '../domain/Profile/TimeStamp';
import IProfileDTO, { ISimulationTotalStats } from '../dto/IProfileDTO';
import { Load } from '../domain/Profile/ProfileLoad';
import { StateOfCharge } from '../domain/Profile/StateOfCharge';
import { PhotovoltaicEnergyLoad } from '../domain/Profile/PhotovoltaicEnergyLoad';
import { BoughtEnergy } from '../domain/Profile/BoughtEnergy';
import { SoldEnergy } from '../domain/Profile/SoldEnergy';
import { Prosumer } from '../domain/Prosumer/Prosumer';
import {  Prosumer as PrismaProsumer } from "@prisma/client";
import { Community as PrismaCommunity } from "@prisma/client";
import { User as PrismaUser } from "@prisma/client";
import { Simulation as PrismaSimulation } from "@prisma/client";
import { ActiveAttributes as PrismaActiveAttributes } from "@prisma/client";
import { Battery as PrismaBattery } from "@prisma/client";
import { Result } from '../core/logic/Result';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { ProsumerMap } from './ProsumerMap';
import { Simulation } from '../domain/Simulation/Simulation';
import { SimulationMap } from './SimulationMap';
import { CommunityMap } from './CommunityMap';
import { strict } from 'assert';
import { TotalStatistics } from '../domain/Statistics/TotalStatistics';

export class ProfileMap {
  public static toDTO(profile: Profile): IProfileDTO {
   
    return {
      id: profile.id.toString(),
      prosumerId: profile.prosumer.id.toString(),
      simulationId: profile.simulation.id.toString(),
      date: profile.date,
      intervalOfTime: profile.timestamp.intervalOfTime,
      numberOfIntervals: profile.timestamp.numberOfIntervals,
      profileLoad: profile.profileLoad.amount,
      stateOfCharge: profile.stateOfCharge.amount,
      energyCharge: profile.batteryCharge.amount,
      energyDischarge: profile.batteryDischarge.amount,
      photovoltaicEnergyLoad: profile.photovoltaicEnergyLoad.amount,
      boughtEnergyPrice: profile.boughtEnergy.price,
      boughtEnergyAmount: profile.boughtEnergy.amount,
      soldEnergyPrice: profile.soldEnergy.price,
      soldEnergyAmount: profile.soldEnergy.amount,
      peerOutputEnergyLoad: profile.peerOutputEnergyLoad.amount,
      peerOutPrice: profile.peerOutputEnergyLoad.price,
      peerInputEnergyLoad: profile.peerInputEnergyLoad.amount,
      peerInPrice: profile.peerInputEnergyLoad.price,
    } as IProfileDTO;
  }

    public static toSimulationStatsDTO(simulation: TotalStatistics): ISimulationTotalStats {
      return {
          totalLoad: simulation.totalLoad,
          totalPhotovoltaicEnergyLoad: simulation.totalPhotovoltaicEnergyLoad,
          totalBoughtEnergy: simulation.totalBoughtEnergy,
          totalSoldEnergy: simulation.totalSoldEnergy,
          totalPeerIn: simulation.totalPeerIn,
          totalPeerOut: simulation.totalPeerOut,
      }
    }

  public static async toDomain(
    rawProfile: IProfilePersistence & {
      prosumer: PrismaProsumer & {
        user?: PrismaUser;
        battery?: PrismaBattery;
        community?: PrismaCommunity;
      };
      simulation: PrismaSimulation & {
        activeAttributes?: Array<PrismaActiveAttributes>;
      };
    }
  ): Promise<Result<Profile>> {
    try {
      // Create value objects
      const timeStamp = TimeStamp.create({
        intervalOfTime: rawProfile.intervalOfTime,
        numberOfIntervals: rawProfile.numberOfIntervals,
      });

      const profileLoad = Load.create({
        amount: rawProfile.profileLoad,
      });

      const stateOfCharge = StateOfCharge.create({
        amount: rawProfile.stateOfCharge,
      });

      const energyCharge = Load.create({
        amount: rawProfile.batteryCharge,
      });
      const energyDischarge = Load.create({
        amount: rawProfile.batteryDischarge,
      });
      // Create value objects for energy loads
      const peerOutputEnergyLoad = SoldEnergy.create({
        price: rawProfile.peerOutPrice,
        amount: rawProfile.peerOutputEnergyLoad,
      });

      const peerInputEnergyLoad = BoughtEnergy.create({
        price: rawProfile.peerInPrice,
        amount: rawProfile.peerInputEnergyLoad,
      });


      const photovoltaicEnergyLoad = PhotovoltaicEnergyLoad.create({
        amount: rawProfile.photovoltaicEnergyLoad,
      });

      const boughtEnergy = BoughtEnergy.create({
        price: rawProfile.boughtEnergyPrice,
        amount: rawProfile.boughtEnergyAmount,
      });

      const soldEnergy = SoldEnergy.create({
        price: rawProfile.soldEnergyPrice,
        amount: rawProfile.soldEnergyAmount,
      });

      // Validate value objects
/*       if (
        timeStamp.isFailure ||
        profileLoad.isFailure ||
        stateOfCharge.isFailure ||
        photovoltaicEnergyLoad.isFailure ||
        boughtEnergy.isFailure ||
        soldEnergy.isFailure
      ) {
        return Result.fail<Profile>("Failed to create Profile value objects");
      } */

      // Map Prosumer
      const prosumerProps = {
        id: rawProfile.prosumer.id,
        userId: rawProfile.prosumer.userId,
        batteryId: rawProfile.prosumer.batteryId,
        user: rawProfile.prosumer.user,
        battery: rawProfile.prosumer.battery,
        communityId: rawProfile.prosumer.communityId,
        community: rawProfile.prosumer.community,
      };


      const prosumerOrError = await ProsumerMap.toDomain(prosumerProps);
      if (prosumerOrError.isFailure) {
        return Result.fail<Profile>(prosumerOrError.error);
      }

      const simulationProps = {
        id: rawProfile.simulation.id,
        startDate: rawProfile.simulation.startDate,
        endDate: rawProfile.simulation.endDate,
        description: rawProfile.simulation.description,
        communityId: rawProfile.simulation.communityId,
        community: rawProfile.prosumer.community,
        activeAttributes: rawProfile.simulation.activeAttributes?.map(attr => ({
          prosumerId: attr.prosumerId,
          profileLoad: attr.profileLoad,
          stateOfCharge: attr.stateOfCharge,
          photovoltaicEnergyLoad: attr.photovoltaicEnergyLoad,
        })) || [],
      };


      // Create Profile
      const profileProps = {
        prosumer: prosumerOrError.getValue(),
        simulation: SimulationMap.toDomainFromDTO(simulationProps, prosumerOrError.getValue().community),
        date: rawProfile.date,
        timestamp: timeStamp/*.getValue()*/,
        profileLoad: profileLoad/*.getValue()*/,
        stateOfCharge: stateOfCharge/*.getValue()*/,
        energyCharge: energyCharge/*.getValue()*/,
        energyDischarge: energyDischarge/*.getValue()*/,
        peerOutputEnergyLoad: peerOutputEnergyLoad/*.getValue()*/,
        peerInputEnergyLoad: peerInputEnergyLoad/*.getValue()*/,
        photovoltaicEnergyLoad: photovoltaicEnergyLoad/*.getValue()*/,
        boughtEnergy: boughtEnergy/*.getValue()*/,
        soldEnergy: soldEnergy/*.getValue()*/,
      };

      const profileOrError = Profile.create(profileProps, new UniqueEntityID(rawProfile.id));
      if (profileOrError.isFailure) {
        return Result.fail<Profile>(profileOrError.error);
      }

      return Result.ok<Profile>(profileOrError.getValue());
    } catch (error) {
      console.error("Error mapping Profile:", error);
      return Result.fail<Profile>("Failed to map Profile from persistence");
    }
  }

  public static toDomainFromDTO(profileDTO: IProfileDTO, prosumer: Prosumer, simulation: Simulation): Result<Profile> {
    // Helper to default null/undefined to 0
    const safe = (val: any) => (val == null || val == undefined) ? 0 : val;

    const timeStamp = TimeStamp.create({
      intervalOfTime: safe(profileDTO.intervalOfTime),
      numberOfIntervals: safe(profileDTO.numberOfIntervals),
    });

    const profileLoad = Load.create({
      amount: safe(profileDTO.profileLoad),
    });

    const stateOfCharge = StateOfCharge.create({
      amount: safe(profileDTO.stateOfCharge),
    });

    const energyCharge = Load.create({
      amount: safe(profileDTO.energyCharge),
    });

    const energyDischarge = Load.create({
      amount: safe(profileDTO.energyDischarge),
    });

    const peerOutputEnergyLoad = SoldEnergy.create({
      price: safe(profileDTO.peerOutPrice),
      amount: safe(profileDTO.peerOutputEnergyLoad),
    });

    const peerInputEnergyLoad = BoughtEnergy.create({
      price: safe(profileDTO.peerInPrice),
      amount: safe(profileDTO.peerInputEnergyLoad),
    });

    const photovoltaicEnergyLoad = PhotovoltaicEnergyLoad.create({
      amount: safe(profileDTO.photovoltaicEnergyLoad),
    });

    const boughtEnergy = BoughtEnergy.create({
      price: safe(profileDTO.boughtEnergyPrice),
      amount: safe(profileDTO.boughtEnergyAmount),
    });

    const soldEnergy = SoldEnergy.create({
      price: safe(profileDTO.soldEnergyPrice),
      amount: safe(profileDTO.soldEnergyAmount),
    });

    const simulationProps = {
      id: simulation.id.toString(),
      startDate: simulation.startDate,
      endDate: simulation.endDate,
      description: simulation.description,
      communityId: simulation.community.id.toString(),
    };

    const profileProps = {
      prosumer: prosumer,
      simulation: SimulationMap.toDomainFromDTO(simulationProps, prosumer.community),
      date: profileDTO.date,
      timestamp: timeStamp,
      profileLoad: profileLoad,
      stateOfCharge: stateOfCharge,
      energyCharge: energyCharge,
      energyDischarge: energyDischarge,
      peerOutputEnergyLoad: peerOutputEnergyLoad,
      peerInputEnergyLoad: peerInputEnergyLoad,
      photovoltaicEnergyLoad: photovoltaicEnergyLoad,
      boughtEnergy: boughtEnergy,
      soldEnergy: soldEnergy,
    };

    return Profile.create(profileProps, new UniqueEntityID(profileDTO.id!));
  }

  public static toPersistence(profile: Profile): any {

    return {
      id: profile.id.toString(),
      prosumerId: profile.prosumer.id.toString(),
      simulationId: profile.simulation.id.toString(),
      date: profile.date,
      intervalOfTime: profile.timestamp.intervalOfTime,
      numberOfIntervals: profile.timestamp.numberOfIntervals,
      profileLoad: profile.profileLoad.amount,
      stateOfCharge: profile.stateOfCharge.amount,
      batteryCharge: profile.batteryCharge.amount,
      batteryDischarge: profile.batteryDischarge.amount,
      photovoltaicEnergyLoad: profile.photovoltaicEnergyLoad.amount,
      boughtEnergyPrice: profile.boughtEnergy.price,
      boughtEnergyAmount: profile.boughtEnergy.amount,
      soldEnergyPrice: profile.soldEnergy.price,
      soldEnergyAmount: profile.soldEnergy.amount,
      peerOutputEnergyLoad: profile.peerOutputEnergyLoad.amount,
      peerOutPrice: profile.peerOutputEnergyLoad.price,
      peerInputEnergyLoad: profile.peerInputEnergyLoad.amount,
      peerInPrice: profile.peerInputEnergyLoad.price,
    };
  }
}
