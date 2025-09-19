import { Profile } from "../../domain/Profile/Profile";
import { Profile as PrismaProfile } from '@prisma/client';
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
  

  // Community profiles
  findBySimulationId(simulationId: string): Promise<Result<Profile[]>>;
  getProfileMonthlyAggregates(simulationId: string): Promise<Result<any[]>>;
  getProfileWeeklyAggregates(simulationId: string): Promise<Result<any[]>>;
  getProfileDailyAggregates(simulationId: string): Promise<Result<any[]>>;
  getProfileHourlyAggregates(simulationId: string): Promise<Result<any[]>>;

  // Prosumer profiles
  getProsumerProfileMonthlyAggregates(prosumerId: string, simulationId: string): Promise<Result<any[]>>;
  getProsumerProfileWeeklyAggregates(prosumerId: string, simulationId: string): Promise<Result<any[]>>;
  getProsumerProfileDailyAggregates(prosumerId: string, simulationId: string): Promise<Result<any[]>>;
  getProsumerProfileHourlyAggregates(prosumerId: string, simulationId: string): Promise<Result<any[]>>;

/*   getProsumerProfileMonthlyAggregates(prosumerId: string, simulationId: string): Promise<Result<PrismaProfile[]>>;
  getProsumerProfileWeeklyAggregates(prosumerId: string, simulationId: string): Promise<Result<PrismaProfile[]>>;
  getProsumerProfileDailyAggregates(prosumerId: string, simulationId: string): Promise<Result<PrismaProfile[]>>;
  getProsumerProfileHourlyAggregates(prosumerId: string, simulationId: string): Promise<Result<PrismaProfile[]>>;
  findByProsumerIdAndSimulationId(prosumerId: string, simulationId: string): Promise<Result<PrismaProfile[]>>; */

  // Statistics
  getSimulationStats(simulationId: string): Promise<Result<TotalStatistics>>;
  countProfilesBySimulationId(simulationId: string): Promise<Result<number>>;
}