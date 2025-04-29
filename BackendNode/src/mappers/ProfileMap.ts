import IProfilePersistence from '../dataschema/IProfilePersistence';
import { Profile } from '../domain/Prosumer/Profile/Profile';
import { TimeStamp } from '../domain/Prosumer/Profile/TimeStamp';
import IProfileDTO from '../dto/IProfileDTO';
import { ProfileLoad } from '../domain/Prosumer/Profile/ProfileLoad';
import { StateOfCharge } from '../domain/Prosumer/Profile/StateOfCharge';
import { PhotovoltaicEnergyLoad } from '../domain/Prosumer/Profile/PhotovoltaicEnergyLoad';
import { BoughtEnergy } from '../domain/Prosumer/Profile/BoughtEnergy';
import { SoldEnergy } from '../domain/Prosumer/Profile/SoldEnergy';
import { Prosumer } from '../domain/Prosumer/Prosumer';
import { Prosumer as PrismaProsumer } from "@prisma/client";
import { User as PrismaUser } from "@prisma/client";
import { Battery as PrismaBattery } from "@prisma/client";
import { Result } from '../core/logic/Result';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { ProsumerMap } from './ProsumerMap';

export class ProfileMap {
  public static toDTO(profile: Profile): IProfileDTO {
    return {
      id: profile.id.toString(),
      prosumerId: profile.prosumer.id.toString(),
      intervalOfTime: profile.timestamp.intervalOfTime,
      numberOfIntervals: profile.timestamp.numberOfIntervals,
      profileLoad: profile.profileLoad.amount,
      stateOfCharge: profile.stateOfCharge.amount,
      photovoltaicEnergyLoad: profile.photovoltaicEnergyLoad.amount,
      boughtEnergyPrice: profile.boughtEnergy.price,
      boughtEnergyAmount: profile.boughtEnergy.amount,
      soldEnergyPrice: profile.soldEnergy.price,
      soldEnergyAmount: profile.soldEnergy.amount,
    } as IProfileDTO;
  }

  public static async toDomain(rawProfile: IProfilePersistence & { prosumer: PrismaProsumer & { user?: PrismaUser; battery?: PrismaBattery } }): Promise<Result<Profile>> {
    try {
      // Create value objects
      const timeStamp = TimeStamp.create({
        intervalOfTime: rawProfile.intervalOfTime,
        numberOfIntervals: rawProfile.numberOfIntervals,
      });

      const profileLoad = ProfileLoad.create({
        amount: rawProfile.profileLoad,
      });

      const stateOfCharge = StateOfCharge.create({
        amount: rawProfile.stateOfCharge,
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
      };

      const prosumerOrError = await ProsumerMap.toDomain(prosumerProps);
      if (prosumerOrError.isFailure) {
        return Result.fail<Profile>(prosumerOrError.error);
      }

      // Create Profile
      const profileProps = {
        prosumer: prosumerOrError.getValue(),
        timestamp: timeStamp/*.getValue()*/,
        profileLoad: profileLoad/*.getValue()*/,
        stateOfCharge: stateOfCharge/*.getValue()*/,
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

  public static toDomainFromDTO(profileDTO: IProfileDTO, prosumer: Prosumer): Result<Profile> {
    const timeStamp = TimeStamp.create({
      intervalOfTime: profileDTO.intervalOfTime,
      numberOfIntervals: profileDTO.numberOfIntervals,
    });

    const profileLoad = ProfileLoad.create({
      amount: profileDTO.profileLoad,
    });

    const stateOfCharge = StateOfCharge.create({
      amount: profileDTO.stateOfCharge,
    });
    const photovoltaicEnergyLoad = PhotovoltaicEnergyLoad.create({
      amount: profileDTO.photovoltaicEnergyLoad,
    });
    const boughtEnergy = BoughtEnergy.create({
      price: profileDTO.boughtEnergyPrice,
      amount: profileDTO.boughtEnergyAmount,
    });

    const soldEnergy = SoldEnergy.create({
      price: profileDTO.soldEnergyPrice,
      amount: profileDTO.soldEnergyAmount,
    });

    const profileProps = {
      prosumer: prosumer,
      timestamp: timeStamp,
      profileLoad: profileLoad,
      stateOfCharge: stateOfCharge,
      photovoltaicEnergyLoad: photovoltaicEnergyLoad,
      boughtEnergy: boughtEnergy,
      soldEnergy: soldEnergy,
    };
    
    return Profile.create(profileProps,new UniqueEntityID(profileDTO.id!));
  }
  

  public static toPersistence(profile: Profile): any {

    return {
      id: profile.id.toString(),
      prosumerId: profile.prosumer.id.toString(),
      intervalOfTime: profile.timestamp.intervalOfTime,
      numberOfIntervals: profile.timestamp.numberOfIntervals,
      profileLoad: profile.profileLoad.amount,
      stateOfCharge: profile.stateOfCharge.amount,
      photovoltaicEnergyLoad: profile.photovoltaicEnergyLoad.amount,
      boughtEnergyPrice: profile.boughtEnergy.price,
      boughtEnergyAmount: profile.boughtEnergy.amount,
      soldEnergyPrice: profile.soldEnergy.price,
      soldEnergyAmount: profile.soldEnergy.amount,
    };
  }
}
