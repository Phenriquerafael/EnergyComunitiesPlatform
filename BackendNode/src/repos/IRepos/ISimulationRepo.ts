
import { Repo } from "../../core/infra/Repo";
import { Simulation } from "../../domain/Simulation/Simulation";

export default interface ISimulationRepo extends Repo<Simulation> {
    save(simulation: Simulation): Promise<Simulation>;
    findById(id: string): Promise<Simulation>;
    findAll(): Promise<Simulation[]>;
    delete(simulation: Simulation): Promise<void>;
    findByCommunityId(communityId: string): Promise<Simulation[]>;
    deleteByCommunityId(communityId: string): Promise<void>;
}