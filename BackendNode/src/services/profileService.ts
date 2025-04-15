import { Inject, Service } from "typedi";
import config from "../../config";
import IProfileRepo from "../repos/IRepos/IProfileRepo";
import IProfileService from "./IServices/IProfileService";
import { Result } from "../core/logic/Result";
import IProfileDTO from "../dto/IProfileDTO";

@Service()
export default class ProfileService implements IProfileService {
  constructor(
    @Inject(config.repos.profile.name) private profileRepoInstance: IProfileRepo
  ) {
    /* console.log('ProfileService instantiated'); // Debug */
    }
    
    createProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>> {
        throw new Error("Method not implemented.");
    }

    updateProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>> {
        throw new Error("Method not implemented.");
    }

    getProfile(profileId: string): Promise<Result<IProfileDTO>> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<Result<IProfileDTO[]>> {
        throw new Error("Method not implemented.");
    }

    findByUserId(userId: string): Promise<Result<IProfileDTO>> {
        throw new Error("Method not implemented.");
    }

    findByBatteryId(batteryId: string): Promise<Result<IProfileDTO>> {
        throw new Error("Method not implemented.");
    }

}