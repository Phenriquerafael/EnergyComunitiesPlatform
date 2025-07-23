/* type Simulation = {
  startDate: string;
  endDate: string;
  description: string;
  profileLoad: boolean;
  stateOfCharge: boolean;
  photovoltaicEnergyLoad: boolean;
  [key: string]: ISimulationDTO;
}; */

import { Result } from "../../core/logic/Result";
import { Community } from "../../domain/Community/Community";
import { ISimulationDTO, ISimulationDTO2 } from "../../dto/IProfileDTO";

export default interface ISimulationService  {
    createSimulation(simulation: ISimulationDTO, community: Community): Promise<Result<ISimulationDTO>>;
    updateSimulation(simulation: ISimulationDTO): Promise<Result<ISimulationDTO>>;
    getSimulation (simulationId: string): Promise<Result<ISimulationDTO>>;
    findAll(): Promise<Result<ISimulationDTO[]>>;
    //findByCommunityId(communityId: string): Promise<Result<ISimulationDTO[]>>;
    findAll2(): Promise<Result<ISimulationDTO2[]>>;
    delete(simulationId: string): Promise<Result<void>>;
    deleteAll(): Promise<Result<void>>;
}