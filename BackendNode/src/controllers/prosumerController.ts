import { Service } from "typedi";
import { Container } from "../container";
import config from "../../config";
import IProsumerService from "../services/IServices/IProsumerService";
import IProsumerController from "./IControllers/IProsumerController";
import { Request, Response, NextFunction } from "express";
import IProsumerDTO from "../dto/IProsumerDTO";
import { Result } from "../core/logic/Result";

@Service()
export default class ProsumerController implements IProsumerController {
    private get prosumerServiceInstance(): IProsumerService {
        return Container.get(config.services.role.name) as IProsumerService;
    }

  public async createProsumer(req: Request, res: Response, next: NextFunction) {
        try {
            const prosumerOrError = await this.prosumerServiceInstance.createProsumer(req.body);
            
            if (prosumerOrError.isFailure) {
            return res.status(400).json({ message: prosumerOrError.error });
            }
    
            const prosumerDTO = prosumerOrError.getValue();
            return res.status(201).json(prosumerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async updateProsumer(req: Request, res: Response, next: NextFunction) {
        try {
            const prosumerOrError = await this.prosumerServiceInstance.updateProsumer(req.body);
            
            if (prosumerOrError.isFailure) {
            return res.status(400).json({ message: prosumerOrError.error });
            }
    
            const prosumerDTO = prosumerOrError.getValue();
            return res.status(200).json(prosumerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async getProsumer(req: Request, res: Response, next: NextFunction) {
        try {
            const prosumerOrError = await this.prosumerServiceInstance.getProsumer(req.params.id);
            
            if (prosumerOrError.isFailure) {
            return res.status(404).json({ message: prosumerOrError.error });
            }
    
            const prosumerDTO = prosumerOrError.getValue();
            return res.status(200).json(prosumerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async findByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const prosumerOrError = await this.prosumerServiceInstance.findByUserId(req.params.userId);
            
            if (prosumerOrError.isFailure) {
            return res.status(404).json({ message: prosumerOrError.error });
            }
    
            const prosumerDTO = prosumerOrError.getValue();
            return res.status(200).json(prosumerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async findByBatteryId(req: Request, res: Response, next: NextFunction) {
        try {
            const prosumerOrError = await this.prosumerServiceInstance.findByBatteryId(req.params.batteryId);
            
            if (prosumerOrError.isFailure) {
            return res.status(404).json({ message: prosumerOrError.error });
            }
    
            const prosumerDTO = prosumerOrError.getValue();
            return res.status(200).json(prosumerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const prosumersOrError = await this.prosumerServiceInstance.findAll() as Result<IProsumerDTO[]>;
            
            if (prosumersOrError.isFailure) {
            return res.status(404).json({ message: prosumersOrError.error });
            }
    
            const prosumersDTO = prosumersOrError.getValue();
            return res.status(200).json(prosumersDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }

}