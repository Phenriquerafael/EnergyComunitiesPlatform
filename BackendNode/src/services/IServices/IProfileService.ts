import IProfileDTO from "../../dto/IProfileDTO";
import { Result } from "../../core/logic/Result";

export default interface IProfileService {
    createProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>>;
    updateProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>>;
    getProfile(profileId: string): Promise<Result<IProfileDTO>>;
    findByProsumerId(userId: string): Promise<Result<IProfileDTO>>;
    findAll(): Promise<Result<IProfileDTO[]>>;
}