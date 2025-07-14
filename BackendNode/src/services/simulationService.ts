import ISimulationService from "./IServices/ISimulationService";
import { Inject, Service } from 'typedi';
import config from '../../config';
import ISimulationRepo from "../repos/IRepos/ISimulationRepo";
import { Result } from '../core/logic/Result';
import { ISimulationDTO } from "../dto/IProfileDTO";
import { SimulationMap } from "../mappers/SimulationMap";
import { Community } from "../domain/Community/Community";

@Service()
export default class SimulationService implements ISimulationService{
  constructor(@Inject(config.repos.simulation.name) private simulationRepoInstance: ISimulationRepo) {
    /* console.log('ProsumerBatteryService instantiated'); // Debug */
  }

    public async createSimulation(simulationDTO: ISimulationDTO, community:Community): Promise<Result<ISimulationDTO>> {
        try {
        if (!simulationDTO) {
            return Result.fail<ISimulationDTO>('Simulation data is required');
        }
        const simulation = SimulationMap.toDomainFromDTO(simulationDTO, community);
        const simulationOrError = await this.simulationRepoInstance.save(simulation);
        if (simulationOrError.isFailure) {
            return Result.fail<ISimulationDTO>(simulationOrError.error);
        }
        simulationDTO.id = simulationOrError.getValue().id.toString();
        return Result.ok<ISimulationDTO>(simulationDTO);
        } catch (error) {
        console.log('Error creating simulation: ', error);
        return Result.fail<ISimulationDTO>('Error creating simulation');
        }
    }

    public async updateSimulation(simulationDTO: ISimulationDTO): Promise<Result<ISimulationDTO>> {
        try {
            if (!simulationDTO) {
                return Result.fail<ISimulationDTO>('Simulation data is required');
            }
            const simulation = SimulationMap.toDomainFromDTO(simulationDTO,null);
            const simulationOrError = await this.simulationRepoInstance.save(simulation);
            if (simulationOrError.isFailure) {
                return Result.fail<ISimulationDTO>(simulationOrError.error);
            }
            return Result.ok<ISimulationDTO>(simulationDTO);
        } catch (error) {
            console.log('Error updating simulation: ', error);
            return Result.fail<ISimulationDTO>('Error updating simulation');
        }
    }

    public async getSimulation(simulationId: string): Promise<Result<ISimulationDTO>> {
        try {
            if (!simulationId) {
                return Result.fail<ISimulationDTO>('Simulation ID is required');
            }
            const simulationOrError = await this.simulationRepoInstance.findById(simulationId);
            if (simulationOrError.isFailure) {
                return Result.fail<ISimulationDTO>(simulationOrError.error);
            }
            const simulationDTO = SimulationMap.toDto(simulationOrError.getValue());
            return Result.ok<ISimulationDTO>(simulationDTO);
        } catch (error) {
            console.log('Error getting simulation: ', error);
            return Result.fail<ISimulationDTO>('Error getting simulation');
        }
    }

    public async findAll(): Promise<Result<ISimulationDTO[]>> {
        try {
            const simulationsOrError = await this.simulationRepoInstance.findAll();
            if (simulationsOrError.isFailure) {
                return Result.fail<ISimulationDTO[]>(simulationsOrError.error);
            }
            const simulationDTOs = simulationsOrError.getValue().map(simulation => SimulationMap.toDto(simulation));
            return Result.ok<ISimulationDTO[]>(simulationDTOs);
        } catch (error) {
            console.log('Error finding all simulations: ', error);
            return Result.fail<ISimulationDTO[]>('Error finding all simulations');
        }
    }

    public async delete(simulationId: string): Promise<Result<void>> {
        try {
            if (!simulationId) {
                return Result.fail<void>('Simulation ID is required');
            }
            const deleteResult = await this.simulationRepoInstance.delete(simulationId);
            if (deleteResult.isFailure) {
                return Result.fail<void>(deleteResult.error);
            }
            return Result.ok<void>();
        } catch (error) {
            console.log('Error deleting simulation: ', error);
            return Result.fail<void>('Error deleting simulation');
        }
    }

    public async deleteAll(): Promise<Result<void>> {
        try {
            const deleteResult = await this.simulationRepoInstance.deleteAll();
            if (deleteResult.isFailure) {
                return Result.fail<void>(deleteResult.error);
            }
            return Result.ok<void>();
        } catch (error) {
            console.log('Error deleting all simulations: ', error);
            return Result.fail<void>('Error deleting all simulations');
        }
    }

}

    