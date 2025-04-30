import { Inject, Service } from 'typedi';
import config from '../../config';
import IProfileRepo from '../repos/IRepos/IProfileRepo';
import IProfileService from './IServices/IProfileService';
import { Result } from '../core/logic/Result';
import IProfileDTO from '../dto/IProfileDTO';
import IProsumerRepo from '../repos/IRepos/IProsumerRepo';
import { ProfileMap } from '../mappers/ProfileMap';
import IOptimizationResults from '../dto/IOptimizationResults';

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
      // Validate prosumerId
      if (!profileDTO.prosumerId) {
        return Result.fail<IProfileDTO>("Prosumer ID is required");
      }

      // Find Prosumer
      const prosumerResult = await this.prosumerRepoInstance.findById(profileDTO.prosumerId);
      if (prosumerResult.isFailure) {
        return Result.fail<IProfileDTO>(`Prosumer not found: ${prosumerResult.error}`);
      }
      const prosumer = prosumerResult.getValue();

      // Map DTO to Domain
      const profileResult = ProfileMap.toDomainFromDTO(profileDTO, prosumer);
      if (profileResult.isFailure) {
        return Result.fail<IProfileDTO>(`Failed to create Profile: ${profileResult.error}`);
      }
      const profile = profileResult.getValue();

      // Save Profile
      const savedProfileResult = await this.profileRepoInstance.save(profile, prosumer);
      if (savedProfileResult.isFailure) {
        return Result.fail<IProfileDTO>(`Failed to save Profile: ${savedProfileResult.error}`);
      }
      const savedProfile = savedProfileResult.getValue();

      // Map to DTO
      const profileDTOResult = ProfileMap.toDTO(savedProfile);
      return Result.ok<IProfileDTO>(profileDTOResult);

    } catch (error) {
      console.error("Error creating profile:", error);
      return Result.fail<IProfileDTO>(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async createFromOptimizationResults(results: IOptimizationResults): Promise<Result<IProfileDTO>> {
    const prosumersResultOrError = await this.prosumerRepoInstance.findAll();
    if (prosumersResultOrError.isFailure||prosumersResultOrError.getValue().length === 0) {
      return Result.fail<IProfileDTO>('Prosumers not found');
    }
    const prosumers = prosumersResultOrError.getValue();

    /* [
    battery: f8f8f86b-c3e0-4f2f-8752-77a1615a415a
        {
            "id": "94ac0d93-105c-4431-88ff-8cfea5805c2d",
            "firstName": "Pedro",
            "lastName": "Henrique",
            "email": "mailpedro@gmail.com",
            "phoneNumber": "916868690",
            "password": "",
            "role": "2a573337-6a1c-48fe-a46d-705d48f4c4e0",
            "isEmailVerified": true
        },
        {
            "id": "0ab66cba-9be3-4846-8290-7f96c82da46d",
            "firstName": "Lebron",
            "lastName": "James",
            "email": "king@gmail.com",
            "phoneNumber": "916868690",
            "password": "",
            "role": "2a573337-6a1c-48fe-a46d-705d48f4c4e0",
            "isEmailVerified": true
        },
        {
            "id": "c9fcf55c-a941-4f28-b553-dbadd29d5a83",
            "firstName": "Mia",
            "lastName": "Khalifa",
            "email": "Mia@gmail.com",
            "phoneNumber": "916868690",
            "password": "",
            "role": "2a573337-6a1c-48fe-a46d-705d48f4c4e0",
            "isEmailVerified": true
        },
        {
            "id": "dddd6916-8fa8-4aa6-80d9-b7e4c4b0f9aa",
            "firstName": "John",
            "lastName": "cena",
            "email": "jc@gmail.com",
            "phoneNumber": "916868690",
            "password": "",
            "role": "2a573337-6a1c-48fe-a46d-705d48f4c4e0",
            "isEmailVerified": true
        },
        {
            "id": "02e8a235-ab68-48e9-9aad-f6bc386edeaa",
            "firstName": "The",
            "lastName": "Rock",
            "email": "rock@gmail.com",
            "phoneNumber": "916868690",
            "password": "",
            "role": "2a573337-6a1c-48fe-a46d-705d48f4c4e0",
            "isEmailVerified": true
        }
    ] */

    try {
      if (results.total_objective_value === undefined) {
        return Result.fail<IProfileDTO>('Total objective value not found in optimization results');
      }
      if (results.detailed_results===undefined || results.detailed_results.length === 0) {
        return Result.fail<IProfileDTO>('Detailed results not found in optimization results');
      }
      let finalResult;
      for (const result of results.detailed_results) {
        //POR CORRIGIR
        const profileDTO: IProfileDTO = {
          prosumerId: prosumers[Number(result.Prosumer) - 1].id.toString(), // Anexing profile to the prosumers bootstraped in the database
          intervalOfTime: result.Day,
          numberOfIntervals: Number(result.Time_Step),
          stateOfCharge: result.SOC,
          photovoltaicEnergyLoad: result.P_PV_load,
          boughtEnergyAmount: result.P_buy,
          boughtEnergyPrice: "0",
          soldEnergyAmount: result.P_sell,
          soldEnergyPrice: "0",
          profileLoad: result.P_Load,

        };

        const createResult = await this.createProfile(profileDTO);
        if (createResult.isFailure) {
          return Result.fail<IProfileDTO>(`Failed to create profile from optimization results: ${createResult.error}`);
        }

        finalResult = createResult;
        
      }

      // Return the last profile created as a representative result
      return Result.ok<IProfileDTO>(finalResult);    
 
      } catch (error) {
      console.log('Error creating profile from optimization results: ', error);
      return Result.fail<IProfileDTO>('Error creating profile from optimization results');
      
    }
  }


  public async updateProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>> {
    try {
      // Validate and fetch the prosumer if prosumerId is provided
      let prosumer = null;
      if (profileDTO.prosumerId) {
        const prosumerOrError = await this.prosumerRepoInstance.findById(profileDTO.prosumerId);
        if (prosumerOrError.isFailure) {
          return Result.fail<IProfileDTO>('Prosumer not found');
        }
        prosumer = prosumerOrError.getValue();
      }

      // Fetch the existing profile
      const existingProfileOrError = await this.profileRepoInstance.findById(profileDTO.id!);
      if (existingProfileOrError.isFailure) {
        return Result.fail<IProfileDTO>('Profile not found');
      }

      const existingProfile = existingProfileOrError.getValue();

      // Update the prosumer if applicable
      if (prosumer) {
        existingProfile.prosumer = prosumer;
      }

      // Update profile fields based on the provided DTO
      if (profileDTO.intervalOfTime) {
        existingProfile.timestamp.intervalOfTime = profileDTO.intervalOfTime;
      }

      if (profileDTO.numberOfIntervals) {
        existingProfile.timestamp.numberOfIntervals = profileDTO.numberOfIntervals;
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

      // Save the updated profile
      const updatedProfileOrError = await this.profileRepoInstance.save(existingProfile, existingProfile.prosumer);
      if (updatedProfileOrError.isFailure) {
        return Result.fail<IProfileDTO>('Error updating profile');
      }

      return Result.ok<IProfileDTO>(ProfileMap.toDTO(updatedProfileOrError.getValue()));
    } catch (error) {
      console.log('Error updating profile: ', error);
      return Result.fail<IProfileDTO>('Error updating profile');
    }
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
