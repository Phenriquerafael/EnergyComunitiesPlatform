import { Profile } from "../../domain/Profile/Profile";
import { Result } from "../../core/logic/Result";
import { TotalStatistics } from "../../domain/Statistics/TotalStatistics";


export default interface IProfileRepo {
  save(profile: Profile): Promise<Result<Profile>>;
  saveMany(profiles: Profile[]): Promise<Result<Profile[]>>;
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
  deleteBySimulationId(simulationId: string): Promise<Result<void>>;
  getSimulationStats(simulationId: string): Promise<Result<TotalStatistics>>;
  getProfileMonthlyAggregates(simulationId: string): Promise<any[]>;
  countProfilesBySimulationId(simulationId: string): Promise<Result<number>>;
}