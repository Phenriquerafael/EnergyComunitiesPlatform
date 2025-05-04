import { Result } from "../../core/logic/Result";
import ICommunityManagerDTO from "../../dto/ICommunityManagerDTO";

export default interface ICommunityManagerService {
    createCommunityManager(communityManagerDTO: ICommunityManagerDTO): Promise<Result<ICommunityManagerDTO>>;
    updateCommunityManager(communityManagerDTO: ICommunityManagerDTO): Promise<Result<ICommunityManagerDTO>>;
    getCommunityManager(communityManagerId: string): Promise<Result<ICommunityManagerDTO>>;
    findAll(): Promise<Result<ICommunityManagerDTO[]>>;
    findByUserId(userId: string): Promise<Result<ICommunityManagerDTO>>;
    findByCommunityId(communityId: string): Promise<Result<ICommunityManagerDTO>>;
}