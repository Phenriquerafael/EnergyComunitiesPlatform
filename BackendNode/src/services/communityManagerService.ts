import { Inject, Service } from 'typedi';
import config from '../../config';
import ICommunityManagerRepo from '../repos/IRepos/ICommunityManagerRepo';
import ICommunityManagerService from './IServices/ICommunityManagerService';
import { Result } from '../core/logic/Result';
import ICommunityManagerDTO from '../dto/ICommunityManagerDTO';
import { CommunityManagerMap } from '../mappers/CommunityManagerMap';
import { Community } from '../domain/Community/Community';
import ICommunityRepo from '../repos/IRepos/ICommunityRepo';
import IUserRepo from '../repos/IRepos/IUserRepo';

@Service()
export default class CommunityManagerService implements ICommunityManagerService {
  constructor(
    @Inject(config.repos.communityManager.name) private communityManagerRepo: ICommunityManagerRepo,
    @Inject(config.repos.community.name) private communityRepo: ICommunityRepo,
    @Inject(config.repos.user.name) private userRepo: IUserRepo,
  ) {
    /* console.log('CommunityManagerService instantiated'); // Debug */
  }

  public async createCommunityManager(
    communityManagerDTO: ICommunityManagerDTO,
  ): Promise<Result<ICommunityManagerDTO>> {
    try {
      let communityManagerOrError = await this.communityManagerRepo.findByUserId(communityManagerDTO.userId);
      if (communityManagerOrError.isSuccess) {
        return Result.fail<ICommunityManagerDTO>('Community Manager already exists in this universe');
      }

      const communityOrError = await this.communityRepo.findById(communityManagerDTO.communityId);
      if (communityOrError.isFailure) {
        return Result.fail<ICommunityManagerDTO>("Battery doens't exist");
      }

      const userOrError = await this.userRepo.findById(communityManagerDTO.userId);
      /*
            if (userOrError.isFailure) {
                return Result.fail<ICommunityManagerDTO>("User doesn't exist");
            } 
            */

      communityManagerOrError = CommunityManagerMap.toDomainFromDto(
        communityManagerDTO.id,
        communityOrError.getValue(),
        userOrError,
      );

      if (communityManagerOrError.isFailure) {
        return Result.fail<ICommunityManagerDTO>('Error creating communityManager');
      }

      const communityManager = communityManagerOrError.getValue();
      const savedCommunityManager = await this.communityManagerRepo.save(communityManager);
      if (savedCommunityManager.isFailure) {
        return Result.fail<ICommunityManagerDTO>('Error saving communityManager');
      }
      return Result.ok<ICommunityManagerDTO>(CommunityManagerMap.toDTO(savedCommunityManager.getValue()));
    } catch (error) {
      console.log('Error creating communityManager: ', error);
      return Result.fail<ICommunityManagerDTO>('Error creating communityManager');
    }
  }

  public async updateCommunityManager(communityManagerDTO: ICommunityManagerDTO): Promise<Result<ICommunityManagerDTO>> {
    try {
      const communityManagerOrError = await this.communityManagerRepo.findById(communityManagerDTO.id);
      if (communityManagerOrError.isFailure) {
        return Result.fail<ICommunityManagerDTO>("CommunityManager doesn't exist");
      }
      if (
        communityManagerOrError.getValue().community.id.toString() !== communityManagerDTO.communityId &&
        communityManagerDTO.communityId !== undefined
      ) {
        const communityOrError = await this.communityRepo.findById(communityManagerDTO.communityId);
        if (communityOrError.isFailure) {
          return Result.fail<ICommunityManagerDTO>("Community doesn't exist");
        }
        communityManagerOrError.getValue().community = communityOrError.getValue();
      }
      if (
        communityManagerOrError.getValue().user.id.toString() !== communityManagerDTO.userId &&
        communityManagerDTO.userId !== undefined
      ) {
        const userOrError = await this.userRepo.findById(communityManagerDTO.userId);
        /*                if (userOrError.isFailure) {
                    return Result.fail<ICommunityManagerDTO>("User doesn't exist");
                } */

        communityManagerOrError.getValue().user = userOrError /* .getValue() */;
      }

      const updatedCommunityManager = await this.communityManagerRepo.save(communityManagerOrError.getValue());
      if (updatedCommunityManager.isFailure) {
        return Result.fail<ICommunityManagerDTO>('Error updating communityManager');
      }
      return Result.ok<ICommunityManagerDTO>(CommunityManagerMap.toDTO(updatedCommunityManager.getValue()));
    } catch (error) {
      console.log('Error updating communityManager: ', error);
      return Result.fail<ICommunityManagerDTO>('Error updating communityManager');
    }
  }

  public async getCommunityManager(communityManagerId: string): Promise<Result<ICommunityManagerDTO>> {
    try {
      const communityManagerOrError = await this.communityManagerRepo.findById(communityManagerId);
      if (communityManagerOrError.isFailure) {
        return Result.fail<ICommunityManagerDTO>("CommunityManager doesn't exist");
      }
      return Result.ok<ICommunityManagerDTO>(CommunityManagerMap.toDTO(communityManagerOrError.getValue()));
    } catch (error) {
      console.log('Error getting communityManager: ', error);
      return Result.fail<ICommunityManagerDTO>('Error getting communityManager');
    }
  }

  public async findAll(): Promise<Result<ICommunityManagerDTO[]>> {
    try {
      const promsumersOrError = await this.communityManagerRepo.findAll();
      if (promsumersOrError.isFailure) {
        return Result.fail<ICommunityManagerDTO[]>('Error getting all promsumers');
      }
      const promsumers = promsumersOrError.getValue();
      const promsumersDTO = promsumers.map((communityManager) => CommunityManagerMap.toDTO(communityManager));
      return Result.ok<ICommunityManagerDTO[]>(promsumersDTO);
    } catch (error) {
      console.log('Error getting all promsumers: ', error);
      return Result.fail<ICommunityManagerDTO[]>('Error getting all promsumers');
    }
  }

  public async findByUserId(userId: string): Promise<Result<ICommunityManagerDTO>> {
    try {
      const communityManagerOrError = await this.communityManagerRepo.findByUserId(userId);
      if (communityManagerOrError.isFailure) {
        return Result.fail<ICommunityManagerDTO>("CommunityManager doesn't exist");
      }
      return Result.ok<ICommunityManagerDTO>(CommunityManagerMap.toDTO(communityManagerOrError.getValue()));
    } catch (error) {
      console.log('Error finding communityManager by userId: ', error);
      return Result.fail<ICommunityManagerDTO>('Error finding communityManager by userId');
    }
  }

  public async findByCommunityId(communityId: string): Promise<Result<ICommunityManagerDTO>> {
    try {
      const communityManagerOrError = await this.communityManagerRepo.findByCommunityId(communityId);
      if (communityManagerOrError.isFailure) {
        return Result.fail<ICommunityManagerDTO>("CommunityManager doesn't exist");
      }
      return Result.ok<ICommunityManagerDTO>(CommunityManagerMap.toDTO(communityManagerOrError.getValue()));
    } catch (error) {
      console.log('Error finding communityManager by communityId: ', error);
      return Result.fail<ICommunityManagerDTO>('Error finding communityManager by communityId');
    }
  }
}
