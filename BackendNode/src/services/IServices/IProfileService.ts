import IProfileDTO, { IMonthlyProfileStatsDTO } from "../../dto/IProfileDTO";
import { Result } from "../../core/logic/Result";
import IOptimizationResults from "../../dto/IOptimizationResults";
import { Prosumer } from "../../domain/Prosumer/Prosumer";
import { Simulation } from "../../domain/Simulation/Simulation";

export default interface IProfileService {
    createProfile(profileDTO: IProfileDTO,prosumer:Prosumer,simulation:Simulation): Promise<Result<IProfileDTO>>;
    createFromOptimizationResults(results: IOptimizationResults): Promise<Result<void>>;
    updateProfile(profileDTO: IProfileDTO): Promise<Result<IProfileDTO>>;
    getProfile(profileId: string): Promise<Result<IProfileDTO>>;
    findByProsumerId(userId: string): Promise<Result<IProfileDTO[]>>;
    findAll(): Promise<Result<IProfileDTO[]>>;
    findByProsumerIdAndSimulationId(prosumerId: string, simulationId: string): Promise<Result<IProfileDTO[]>>;
    findBySimulationId(simulationId: string): Promise<Result<IProfileDTO[]>>;
    findByCommunityIdAndSimulationId(communityId: string, simulationId: string): Promise<Result<IProfileDTO[]>>;
    
    deleteProfile(profileId: string): Promise<Result<void>>;
    findByCommunityId(communityId: string): Promise<Result<IProfileDTO[]>>;
    deleteByCommunityId(communityId: string): Promise<Result<void>>;
    deleteByProsumerId(prosumerId: string): Promise<Result<void>>;

    getSimulationStats(simulationId: string): Promise<Result<any>>;
    getMonthlyStats(simulationId: string): Promise<Result<IProfileDTO[]>>
    countProfilesBySimulationId(simulationId: string): Promise<Result<number>>;
}