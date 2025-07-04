import IProfileDTO from "../../dto/IProfileDTO";
import { Result } from "../../core/logic/Result";
import IOptimizationResults from "../../dto/IOptimizationResults";

export default interface IProfileService {
    createProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>>;
    createFromOptimizationResults(results: IOptimizationResults): Promise<Result<IProfileDTO>>;
    updateProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>>;
    getProfile(profileId: string): Promise<Result<IProfileDTO>>;
    findByProsumerId(userId: string): Promise<Result<IProfileDTO[]>>;
    findAll(): Promise<Result<IProfileDTO[]>>;
    deleteProfile(profileId: string): Promise<Result<void>>;
    findByCommunityId(communityId: string): Promise<Result<IProfileDTO[]>>;
    deleteByCommunityId(communityId: string): Promise<Result<void>>;
    deleteByProsumerId(prosumerId: string): Promise<Result<void>>;
}