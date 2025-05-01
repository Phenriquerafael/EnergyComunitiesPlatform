import { Profile } from "../../domain/Prosumer/Profile/Profile";
import { Result } from "../../core/logic/Result";
import { Prosumer } from "../../domain/Prosumer/Prosumer";


export default interface IProfileRepo {
  save(profile: Profile, prosumer: Prosumer): Promise<Result<Profile>>;
  findById(id: string): Promise<Result<Profile>>;
  findByProsumerId(prosumerId: string): Promise<Result<Profile>>;
  findAll(): Promise<Result<Profile[]>>;
  delete(profile: Profile): Promise<Result<void>>;
}