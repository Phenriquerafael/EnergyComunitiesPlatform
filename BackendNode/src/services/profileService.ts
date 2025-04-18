import { Inject, Service } from 'typedi';
import config from '../../config';
import IProfileRepo from '../repos/IRepos/IProfileRepo';
import IProfileService from './IServices/IProfileService';
import { Result } from '../core/logic/Result';
import IProfileDTO from '../dto/IProfileDTO';
import { TimeStamp } from '../domain/Prosumer/Profile/TimeStamp';
import { ProfileLoad } from '../domain/Prosumer/Profile/ProfileLoad';
import { StateOfCharge } from '../domain/Prosumer/Profile/StateOfCharge';
import { PhotovoltaicEnergyLoad } from '../domain/Prosumer/Profile/PhotovoltaicEnergyLoad';
import { BoughtEnergy } from '../domain/Prosumer/Profile/BoughtEnergy';
import { SoldEnergy } from '../domain/Prosumer/Profile/SoldEnergy';
import { Profile } from '../domain/Prosumer/Profile/Profile';
import IProsumerRepo from '../repos/IRepos/IProsumerRepo';
import { ProfileMap } from '../mappers/ProfileMap';

@Service()
export default class ProfileService implements IProfileService {
  constructor(
    @Inject(config.repos.profile.name) private profileRepoInstance: IProfileRepo,
    @Inject(config.repos.prosumer.name) private prosumerRepoInstance: IProsumerRepo,
  ) {
    /* console.log('ProfileService instantiated'); // Debug */
  }

  public async createProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>> {
    try {
      try {
        const prosumer = profileDTO.prosumerId ? await this.prosumerRepoInstance.findById(profileDTO.prosumerId) : null;

        const profile = ProfileMap.toDomain(profileDTO, prosumer ? prosumer.getValue() : null);

        return this.profileRepoInstance.save(profile.getValue()).then((profile) => {
          return Result.ok<IProfileDTO>(ProfileMap.toDTO(profile.getValue()));
        });
      } catch (error) {
        console.log('Error creating profile: ', error);
        return Result.fail<IProfileDTO>('Error creating profile');
      }
    } catch (error) {
      console.log('Error creating profile: ', error);
      return Result.fail<IProfileDTO>('Error creating profile');
    }
  }

  public async updateProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>> {
    const existingProfileOrError = await this.profileRepoInstance.findById(profileDTO.id!);
    if (existingProfileOrError.isFailure) {
      return Result.fail<IProfileDTO>('Profile not found');
    }

    const existingProfile = existingProfileOrError.getValue();

    if (profileDTO.prosumerId) {
      const prosumer = await this.prosumerRepoInstance.findById(profileDTO.prosumerId);
      if (prosumer.isFailure) {
        return Result.fail<IProfileDTO>('Prosumer not found');
      }
      existingProfile.prosumer = prosumer.getValue();
    }

    if (profileDTO.intervalOfTime) {
      existingProfile.timestamp.intervaleOfTime = profileDTO.intervalOfTime;
    }

    if (profileDTO.numberOfIntervales) {
      existingProfile.timestamp.numberOfIntervales = profileDTO.numberOfIntervales;
    }

    if (profileDTO.profileLoad) {
      existingProfile.profileLoad.amount = profileDTO.profileLoad;
    }

    if (profileDTO.stateOfCharge) {
      existingProfile.stateOfCharge.amount = profileDTO.stateOfCharge;
    }

    if (profileDTO.photovoltaicEnergyLoad) {
      existingProfile.photovoltaicEnergyLoad.amount = profileDTO.photovoltaicEnergyLoad;
    }

    if (profileDTO.boughtEnergyPrice) {
      existingProfile.boughtEnergy.price = profileDTO.boughtEnergyPrice;
    }

    if (profileDTO.boughtEnergyAmount) {
      existingProfile.boughtEnergy.amount = profileDTO.boughtEnergyAmount;
    }

    if (profileDTO.soldEnergyPrice) {
      existingProfile.soldEnergy.price = profileDTO.soldEnergyPrice;
    }

    if (profileDTO.soldEnergyAmount) {
      existingProfile.soldEnergy.amount = profileDTO.soldEnergyAmount;
    }

    const updatedProfile = await this.profileRepoInstance.save(existingProfile);
    if (updatedProfile.isFailure) {
      return Result.fail<IProfileDTO>('Error updating profile');
    }
    return Result.ok<IProfileDTO>(ProfileMap.toDTO(updatedProfile.getValue()));
  }

  public async getProfile(profileId: string): Promise<Result<IProfileDTO>> {
    try {
      const existingProfileOrError = await this.profileRepoInstance.findById(profileId);
      if (existingProfileOrError.isFailure) {
        return Result.fail<IProfileDTO>('Profile not found');
      }
      const existingProfile = existingProfileOrError.getValue();
      return Result.ok<IProfileDTO>(ProfileMap.toDTO(existingProfile));
    } catch (error) {
      console.log('Error getting profile: ', error);
      return Result.fail<IProfileDTO>('Error getting profile');
    }
  }

  public async findAll(): Promise<Result<IProfileDTO[]>> {
    try {
      const profilesOrError = await this.profileRepoInstance.findAll();
      if (profilesOrError.isFailure) {
        return Result.fail<IProfileDTO[]>('Profiles not found');
      }
      const profiles = profilesOrError.getValue();
      return Result.ok<IProfileDTO[]>(profiles.map((profile) => ProfileMap.toDTO(profile)));
    } catch (error) {
      console.log('Error getting all profiles: ', error);
      return Result.fail<IProfileDTO[]>('Error getting all profiles');
    }
  }

  public async findByProsumerId(userId: string): Promise<Result<IProfileDTO>> {
    try {
      const existingProfileOrError = await this.profileRepoInstance.findByProsumerId(userId);
      if (existingProfileOrError.isFailure) {
        return Result.fail<IProfileDTO>('Profile not found');
      }
      const existingProfile = existingProfileOrError.getValue();
      return Result.ok<IProfileDTO>(ProfileMap.toDTO(existingProfile));
    } catch (error) {
      console.log('Error getting profile by prosumer ID: ', error);
      return Result.fail<IProfileDTO>('Error getting profile by prosumer ID');
    }
  }
}
