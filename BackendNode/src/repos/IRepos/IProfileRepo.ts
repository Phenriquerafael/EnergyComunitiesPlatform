import { Profile } from "../../domain/Prosumer/Profile/Profile";

export default interface IProfileRepo {
  save(profile: Profile): Promise<Profile>;
  findById(id: string): Promise<Profile>;
  findByProsumerId(prosumerId: string): Promise<Profile>;
  findAll(): Promise<Profile[]>;
}