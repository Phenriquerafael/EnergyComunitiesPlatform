import { Result } from "../../core/logic/Result";
import ICommunityDTO from "../../dto/ICommunityDTO";

export default interface ICommunityService {
    createCommunity(communityDTO: ICommunityDTO): Promise<Result<ICommunityDTO>>;
    updateCommunity(communityDTO: ICommunityDTO): Promise<Result<ICommunityDTO>>;
    getCommunity(communityId: string): Promise<Result<ICommunityDTO>>;
    findAll(): Promise<Result<ICommunityDTO[]>>;
}