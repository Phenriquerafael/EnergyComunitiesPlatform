import { Profile } from "../../domain/Prosumer/Profile/Profile";
import { Result } from "../../core/logic/Result";
import { Prosumer } from "../../domain/Prosumer/Prosumer";
import { Simulation } from "../../domain/Simulation/Simulation";


export default interface IProfileRepo {
  save(profile: Profile): Promise<Result<Profile>>;
  findById(id: string): Promise<Result<Profile>>;
  findByProsumerId(prosumerId: string): Promise<Result<Profile[]>>;
  findAll(): Promise<Result<Profile[]>>;
  findByProsumerIdAndSimulationId(prosumerId: string, simulationId: string): Promise<Result<Profile[]>>;
  findBySimulationId(simulationId: string): Promise<Result<Profile[]>>;
  findByCommunityIdAndSimulationId(communityId: string, simulationId: string): Promise<Result<Profile[]>>;
  delete(profile: Profile): Promise<Result<void>>;
  findByCommunityId(communityId: string): Promise<Result<Profile[]>>;
  deleteByCommunityId(communityId: string): Promise<Result<void>>;
  deleteByProsumerId(prosumerId: string): Promise<Result<void>>;

}