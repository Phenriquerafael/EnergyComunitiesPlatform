import { Inject, Service } from 'typedi';
import config from '../../config';
import IProfileRepo from '../repos/IRepos/IProfileRepo';
import IProfileService from './IServices/IProfileService';
import { Result } from '../core/logic/Result';
import IProfileDTO, { ISimulationDTO } from '../dto/IProfileDTO';
import IProsumerRepo from '../repos/IRepos/IProsumerRepo';
import { ProfileMap } from '../mappers/ProfileMap';
import IOptimizationResults from '../dto/IOptimizationResults';
import ISimulationService from './IServices/ISimulationService';
import { SimulationMap } from '../mappers/SimulationMap';
import { Prosumer } from '../domain/Prosumer/Prosumer';
import { Simulation } from '../domain/Simulation/Simulation';
import ISimulationRepo from '../repos/IRepos/ISimulationRepo';
import ICommunityRepo from '../repos/IRepos/ICommunityRepo';


@Service()
export default class ProfileService implements IProfileService {
  constructor(
    @Inject(config.repos.profile.name) private profileRepoInstance: IProfileRepo,
    @Inject(config.repos.prosumer.name) private prosumerRepoInstance: IProsumerRepo,
    @Inject(config.repos.simulation.name) private simulationRepoInstance: ISimulationRepo,
    @Inject(config.repos.community.name) private communityRepoInstance: ICommunityRepo, // Assuming you have a community repo
    @Inject(config.services.simulation.name) private simulationServiceInstance: ISimulationService, // Assuming you have a simulation repo
    @Inject('logger') private logger
  ) {
    /* console.log('ProfileService instantiated'); // Debug */
  }

  public async createProfile(profileDTO: IProfileDTO, prosumer:Prosumer, simulation:Simulation): Promise<Result<IProfileDTO>> {
    try {
    
      // Map DTO to Domain
      const profileResult = ProfileMap.toDomainFromDTO(profileDTO, prosumer, simulation);
      if (profileResult.isFailure) {
        return Result.fail<IProfileDTO>(`Failed to create Profile: ${profileResult.error}`);
      }
      const profile = profileResult.getValue(); 


      // Save Profile
      const savedProfileResult = await this.profileRepoInstance.save(profile);
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

  public async createFromOptimizationResults(results: IOptimizationResults): Promise<Result<void>> {
    try {
      console.log('Creating profile from optimization results:', results.detailed_results.length, 'results found');
      if (results.total_objective_value === undefined) {
        return Result.fail<void>('Total objective value not found in optimization results');
      }
      if (results.detailed_results === undefined || results.detailed_results.length === 0) {
        return Result.fail<void>('Detailed results not found in optimization results');
      }

      let prosumerOrError;
      const prosumerProfileCount: Record<string, number> = {};
      const simulationDTO = 
        {
          startDate: results.start_date,
          endDate: results.end_date,
          description: results.description || '',
          communityId: results.communityId,
          activeAttributes: results.active_attributes.map(attr => ({
            prosumerId: attr.prosumerId,
            profileLoad: attr.profileLoad,
            stateOfCharge: attr.stateOfCharge,
            photovoltaicEnergyLoad: attr.photovoltaicEnergyLoad
          }))

        } as ISimulationDTO;

        // Fetch the community based on communityId
        const communityOrError = await this.communityRepoInstance.findById(results.communityId);
        if (communityOrError.isFailure) {
          return Result.fail<void>(`Community with ID ${results.communityId} not found`);
        }
        const community = communityOrError.getValue();

        const simulationOrError = await this.simulationServiceInstance.createSimulation(simulationDTO, community);
        if (simulationOrError.isFailure) {
          return Result.fail<void>(`Failed to create simulation: ${simulationOrError.error}`);
        }
        const simulation = await this.simulationRepoInstance.findById(simulationOrError.getValue().id);


      for (let i = 0; i < results.detailed_results.length; i++) {
        let result = results.detailed_results[i];
        const profileDTO: IProfileDTO = {
          prosumerId: result.Prosumer,
          simulationId: simulationDTO.id, // Simulation will be set later
          date: result.DateTime,
          intervalOfTime: "15",
          numberOfIntervals: Number(result.Time_Step),
          stateOfCharge: result.SOC,
          energyCharge: result.P_ESS_ch,
          energyDischarge: result.P_ESS_dch,
          peerOutputEnergyLoad: result.P_Peer_out,
          peerInputEnergyLoad: result.P_Peer_in,
          photovoltaicEnergyLoad: result.P_PV_load,
          boughtEnergyAmount: result.P_buy,
          soldEnergyAmount: result.P_sell,
          profileLoad: result.P_Load,
        };
        
        if ( !prosumerOrError ||prosumerOrError.id !== profileDTO.prosumerId ) {
          prosumerOrError = await this.prosumerRepoInstance.findById(profileDTO.prosumerId);
          if (prosumerOrError.isFailure) {
            return Result.fail<void>(`Prosumer with ID ${profileDTO.prosumerId} not found`);
          }
        }

        const createResult = await this.createProfile(profileDTO,prosumerOrError.getValue(), simulation.getValue());

        if (createResult.isFailure) {
          return Result.fail<void>(`Failed to create profile from optimization results: ${createResult.error}`);
        }

        // Count profiles per prosumer
        if (prosumerProfileCount[profileDTO.prosumerId]) {
          prosumerProfileCount[profileDTO.prosumerId]++;
        } else {
          prosumerProfileCount[profileDTO.prosumerId] = 1;
        }


      }

      // Log the number of profiles loaded for each prosumer
      Object.entries(prosumerProfileCount).forEach(([prosumerId, count]) => {
        this.logger.info(`Loaded ${count} profiles for prosumer ${prosumerId}`);
      });

      // Return the last profile created as a representative result
      return Result.ok<void>(/* finalResult */);

    } catch (error) {
      this.logger.error('Error creating profile from optimization results: ', error);
      return Result.fail<void>('Error creating profile from optimization results');
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
      const updatedProfileOrError = await this.profileRepoInstance.save(existingProfile);
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

  public async findByProsumerId(userId: string): Promise<Result<IProfileDTO[]>> {
    try {
      const existingProfileOrError = await this.profileRepoInstance.findByProsumerId(userId);
      if (existingProfileOrError.isFailure) {
        return Result.fail<IProfileDTO[]>('Profile not found');
      }
      const existingProfile = existingProfileOrError.getValue();
      return Result.ok<IProfileDTO[]>(Array.isArray(existingProfile) ? existingProfile.map(ProfileMap.toDTO) : [ProfileMap.toDTO(existingProfile)]);
      
    } catch (error) {
      console.log('Error getting profile by prosumer ID: ', error);
      return Result.fail<IProfileDTO[]>('Error getting profile by prosumer ID');
    }
  }

  public async deleteProfile(profileId: string): Promise<Result<void>> {
    try {
      const existingProfileOrError = await this.profileRepoInstance.findById(profileId);

      if (existingProfileOrError.isFailure) {
        return Result.fail<void>('Profile not found');
      }

      const profile = existingProfileOrError.getValue();
      const deleteResult = await this.profileRepoInstance.delete(profile);

      if (deleteResult.isFailure) {
        return Result.fail<void>('Error deleting profile');
      }

      return Result.ok<void>();
    } catch (error) {
      console.error('Error deleting profile:', error);
      return Result.fail<void>('Unexpected error deleting profile');
    }
  }

  public async findByCommunityId(communityId: string): Promise<Result<IProfileDTO[]>> {
    try {
      const profilesOrError = await this.profileRepoInstance.findByCommunityId(communityId);
      if (profilesOrError.isFailure) {
        return Result.fail<IProfileDTO[]>('Profiles not found for community');
      }
      const profiles = profilesOrError.getValue();
      return Result.ok<IProfileDTO[]>(profiles.map((profile) => ProfileMap.toDTO(profile)));
    } catch (error) {
      console.log('Error getting profiles by community ID: ', error);
      return Result.fail<IProfileDTO[]>('Error getting profiles by community ID');
    }
  }

  public async deleteByCommunityId(communityId: string): Promise<Result<void>> {
    try {
      const profilesOrError = await this.profileRepoInstance.findByCommunityId(communityId);
      if (profilesOrError.isFailure) {
        return Result.fail<void>('Profiles not found for community');
      }
      const profiles = profilesOrError.getValue();
      for (const profile of profiles) {
        const deleteResult = await this.profileRepoInstance.delete(profile);
        if (deleteResult.isFailure) {
          return Result.fail<void>('Error deleting profile');
        }
      }
      return Result.ok<void>();
    } catch (error) {
      console.error('Error deleting profiles by community ID:', error);
      return Result.fail<void>('Unexpected error deleting profiles by community ID');
    }
  }

  public async deleteByProsumerId(prosumerId: string): Promise<Result<void>> {
    try {
      const profilesOrError = await this.profileRepoInstance.findByProsumerId(prosumerId);
      if (profilesOrError.isFailure) {
        return Result.fail<void>('Profiles not found for prosumer');
      }
      const profiles = profilesOrError.getValue();
      for (const profile of profiles) {
        const deleteResult = await this.profileRepoInstance.delete(profile);
        if (deleteResult.isFailure) {
          return Result.fail<void>('Error deleting profile');
        }
      }
      return Result.ok<void>();
    } catch (error) {
      console.error('Error deleting profiles by prosumer ID:', error);
      return Result.fail<void>('Unexpected error deleting profiles by prosumer ID');
    }
  }


}
