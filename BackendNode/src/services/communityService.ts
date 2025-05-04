import { Inject, Service } from 'typedi';
import config from '../../config';
import ICommunityService from './IServices/ICommunityService';
import ICommunityRepo from '../repos/IRepos/ICommunityRepo';
import { Result } from '../core/logic/Result';
import ICommunityDTO from '../dto/ICommunityDTO';
import { CommunityMap } from '../mappers/CommunityMap';

@Service()
export default class CommunityService implements ICommunityService {
  constructor(@Inject(config.repos.community.name) private communityRepoInstance: ICommunityRepo) {
    /* console.log('CommunityService instantiated'); // Debug */
  }

  public async createCommunity(communityDTO: ICommunityDTO): Promise<Result<ICommunityDTO>> {
    try {
      const community = CommunityMap.toDomainFromDTO(communityDTO);

        if (community.isFailure) {
            return Result.fail<ICommunityDTO>('Error creating the community');
        }
      
      return this.communityRepoInstance.save(community.getValue()).then((community) => {
        return Result.ok<ICommunityDTO>(CommunityMap.toDTO(community.getValue()));
      });
    } catch (error) {
      console.log('Error creating the community: ', error);
      return Result.fail<ICommunityDTO>('Error creating the community');
    }
  }

  public async updateCommunity(communityDTO: ICommunityDTO): Promise<Result<ICommunityDTO>> {
    try {
      if (!communityDTO.id) {
        return Result.fail<ICommunityDTO>('Community ID is required to update the community');
      }
      const existingCommunityOrError = await this.communityRepoInstance.findById(communityDTO.id);
      if (existingCommunityOrError.isFailure) {
        return Result.fail<ICommunityDTO>('Community was not found');
      }

      const existingCommunity = existingCommunityOrError.getValue();

      if (communityDTO.name) {
        existingCommunity.communityInformation.name = communityDTO.name;
      }
      if (communityDTO.description) {
        existingCommunity.communityInformation.description = communityDTO.description;
      }
      const updatedCommunity = await this.communityRepoInstance.save(existingCommunity);

      if (updatedCommunity.isFailure) {
        return Result.fail<ICommunityDTO>('Error updating the Community in the database');
      }

      return Result.ok<ICommunityDTO>(CommunityMap.toDTO(updatedCommunity.getValue()));
    } catch (error) {
      console.log('Error updating the community: ', error);
      return Result.fail<ICommunityDTO>('Error updating the community');
    }
  }

  public async getCommunity(communityId: string): Promise<Result<ICommunityDTO>> {
    try {
      if (!communityId) {
        return Result.fail<ICommunityDTO>('Community ID is required to get the community');
      }
      const existingCommunityOrError = await this.communityRepoInstance.findById(communityId);
      if (existingCommunityOrError.isFailure) {
        return Result.fail<ICommunityDTO>('Community was not found');
      }

      const existingCommunity = existingCommunityOrError.getValue();

      return Result.ok<ICommunityDTO>(CommunityMap.toDTO(existingCommunity));
    } catch (error) {
      console.log('Error getting the community: ', error);
      return Result.fail<ICommunityDTO>('Error getting the community');
    }
  }

  public async findAll(): Promise<Result<ICommunityDTO[]>> {
    try {
      const communitiesOrError = await this.communityRepoInstance.findAll();
      if (communitiesOrError.isFailure) {
        return Result.fail<ICommunityDTO[]>('Error getting all the communities');
      }
      const communities = communitiesOrError.getValue();
      const communityDTOs = communities.map((community) => CommunityMap.toDTO(community));
      return Result.ok<ICommunityDTO[]>(communityDTOs);
    } catch (error) {
      console.log('Error getting all the communities: ', error);
      return Result.fail<ICommunityDTO[]>('Error getting all the communities');
    }
  }
}
