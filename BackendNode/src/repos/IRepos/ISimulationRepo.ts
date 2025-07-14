
import { Result } from '../../core/logic/Result';
import { Simulation } from "../../domain/Simulation/Simulation";

export default interface ISimulationRepo  {
    save(simulation: Simulation): Promise<Result<Simulation>>;
    findById(id: string): Promise<Result<Simulation>>;
    findAll(): Promise<Result<Simulation[]>>;
    delete(simulationId: string): Promise<Result<void>>;
/*     findByCommunityId(communityId: string): Promise<Result<Simulation[]>>;
    deleteByCommunityId(communityId: string): Promise<Result<void>>; */
    deleteAll(): Promise<Result<void>>;
}