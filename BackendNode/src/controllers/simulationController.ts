import ISimulationController from "./IControllers/ISimulationController";
import { Inject, Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { Result } from '../core/logic/Result';
import { Container } from '../container';
import ISimulationService from "../services/IServices/ISimulationService";
import config from "../../config";

@Service()
export default class SimulationController implements ISimulationController {

    private get simulationServiceInstance(): ISimulationService {
        return Container.get(config.services.simulation.name) as ISimulationService;
    }

    public async createSimulation(req: Request, res: Response, next: NextFunction) {
        try {
            const simulationDTO = req.body;
            const result = await this.simulationServiceInstance.createSimulation(simulationDTO, req.body.community);
            if (result.isFailure) {
                return res.status(400).json({ message: result.error });
            }
            return res.status(201).json({ data: result.getValue() });
        } catch (error) {
            return next(error);
        }
    }

    public async updateSimulation(req: Request, res: Response, next: NextFunction) {
        try {
            const simulationDTO = req.body;
            simulationDTO.id = req.params.id; // Ensure the ID is set from the request parameters
            const result = await this.simulationServiceInstance.updateSimulation(simulationDTO);
            if (result.isFailure) {
                return res.status(400).json({ message: result.error });
            }
            return res.status(200).json({ data: result.getValue() });
        } catch (error) {
            return next(error);
        }
    }

    public async getSimulation(req: Request, res: Response, next: NextFunction) {
        try {
            const simulationId = req.params.id;
            const result = await this.simulationServiceInstance.getSimulation(simulationId);
            if (result.isFailure) {
                return res.status(404).json({ message: result.error });
            }
            return res.status(200).json({ data: result.getValue() });
        } catch (error) {
            return next(error);
        }
    }



    public async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.simulationServiceInstance.findAll();
            if (result.isFailure) {
                return res.status(404).json({ message: result.error });
            }
            return res.status(200).json({ data: result.getValue() });
        } catch (error) {
            return next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const simulationId = req.params.id;
            const result = await this.simulationServiceInstance.delete(simulationId);
            if (result.isFailure) {
                return res.status(404).json({ message: result.error });
            }
            return res.status(200).json({ message: 'Simulation deleted successfully' });
        } catch (error) {
            return next(error);
        }
    }

    public async deleteAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.simulationServiceInstance.deleteAll();
            if (result.isFailure) {
                return res.status(404).json({ message: result.error });
            }
            return res.status(200).json({ message: 'All simulations deleted successfully' });
        } catch (error) {
            return next(error);
        }
    }
    
}