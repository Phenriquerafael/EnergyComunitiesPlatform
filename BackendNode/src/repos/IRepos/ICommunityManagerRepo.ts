import { Result } from '../../core/logic/Result';
import { CommunityManager } from '../../domain/CommunityManager/CommunityManager';


export default interface ICommunityManagerRepo {
  save(communityManager: CommunityManager): Promise<Result<CommunityManager>>;
  findById(id: string): Promise<Result<CommunityManager>>;
  findAll(): Promise<Result<CommunityManager[]>>;
  findByUserId(userId: string): Promise<Result<CommunityManager>>;
  findByCommunityId(communityId: string): Promise<Result<CommunityManager>>;
}