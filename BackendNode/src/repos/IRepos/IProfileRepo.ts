import { Profile } from "../../domain/Prosumer/Profile/Profile";
import { Result } from "../../core/logic/Result";

export default interface IProfileRepo {
  save(profile: Profile): Promise<Result<Profile>>;
  findById(id: string): Promise<Result<Profile>>;
  findByProsumerId(prosumerId: string): Promise<Result<Profile>>;
  findAll(): Promise<Result<Profile[]>>;
}