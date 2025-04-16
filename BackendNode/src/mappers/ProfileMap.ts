import IProfilePersistence from '../dataschema/IProfilePersitence';
import { Profile } from '../domain/Prosumer/Profile/Profile';
import { TimeStamp } from '../domain/Prosumer/Profile/TimeStamp';
import IProfileDTO from '../dto/IProfileDTO';
import { ProfileLoad } from '../domain/Prosumer/Profile/ProfileLoad';
import { StateOfCharge } from '../domain/Prosumer/Profile/StateOfCharge';
import { PhotovoltaicEnergyLoad } from '../domain/Prosumer/Profile/PhotovoltaicEnergyLoad';
import { BoughtEnergy } from '../domain/Prosumer/Profile/BoughtEnergy';
import { SoldEnergy } from '../domain/Prosumer/Profile/SoldEnergy';
import { Prosumer } from '../domain/Prosumer/Prosumer';
import { Result } from '../core/logic/Result';

export class ProfileMap {
  public static toDTO(profile: Profile): IProfileDTO {
    return {
      id: profile.id.toString(),
      prosumerId: profile.prosumer.id.toString(),
      intervalOfTime: profile.timestamp.intervaleOfTime,
      numberOfIntervales: profile.timestamp.numberOfIntervales,
      profileLoad: profile.profileLoad.amount,
      stateOfCharge: profile.stateOfCharge.amount,
      photovoltaicEnergyLoad: profile.photovoltaicEnergyLoad.amount,
      boughtEnergyPrice: profile.boughtEnergy.price,
      boughtEnergyAmount: profile.boughtEnergy.amount,
      soldEnergyPrice: profile.soldEnergy.price,
      soldEnergyAmount: profile.soldEnergy.amount,
    } as IProfileDTO;
  }

  public static toDomain(profileDTO: IProfileDTO, prosumer: Prosumer): Result<Profile> {

    const timeStamp = TimeStamp.create({
      intervaleOfTime: profileDTO.intervalOfTime,
      numberOfIntervales: profileDTO.numberOfIntervales,
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
    
    return Profile.create(profileProps);
  }

  public static toPersistence(profile: Profile): any {
    return {
      id: profile.id.toString(),
      prosumerId: profile.prosumer.id.toString(),
      intervalOfTime: profile.timestamp.intervaleOfTime,
      numberOfIntervales: profile.timestamp.numberOfIntervales,
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
