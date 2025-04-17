import { Service } from "typedi";
import IProfileRepo from "./IRepos/IProfileRepo";
import { Result } from "../core/logic/Result";
import { Profile } from "../domain/Prosumer/Profile/Profile";

@Service()
export default class ProfileRepo implements IProfileRepo {
    save(profile: Profile): Promise<Result<Profile>> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Result<Profile>> {
        throw new Error("Method not implemented.");
    }
    findByProsumerId(prosumerId: string): Promise<Result<Profile>> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Result<Profile[]>> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<Result<void>> {
        throw new Error("Method not implemented.");
    }
}