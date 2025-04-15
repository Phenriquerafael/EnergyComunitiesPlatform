import { Request, Response, NextFunction } from "express";
import { Container } from "../container";
import IProsumerBatteryController from "./IControllers/IProsumerBatteryController";
import IProsumerBatteryService from "../services/IServices/IProsumerBatteryService";
import config from "../../config";
import { Service } from "typedi";
import { Result } from "../core/logic/Result";
import IBatteryDTO from "../dto/IBatteryDTO";

@Service()
export default class ProsumerBatteryController implements IProsumerBatteryController {

  private get prosumerBatteryServiceInstance(): IProsumerBatteryService {
    return Container.get(config.services.role.name) as IProsumerBatteryService;
  }  
  
  public async createProsumerBattery(req: Request, res: Response, next: NextFunction) {
      try {
        const prosumerBatteryOrError = await this.prosumerBatteryServiceInstance.createProsumerBattery(req.body);
        
        if (prosumerBatteryOrError.isFailure) {
          return res.status(400).json({ message: prosumerBatteryOrError.error });
        }
  
        const prosumerBatteryDTO = prosumerBatteryOrError.getValue();
        return res.status(201).json(prosumerBatteryDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async updateProsumerBattery(req: Request, res: Response, next: NextFunction) {
      try {
        const prosumerBatteryOrError = await this.prosumerBatteryServiceInstance.updateProsumerBattery(req.body);
        
        if (prosumerBatteryOrError.isFailure) {
          return res.status(400).json({ message: prosumerBatteryOrError.error });
        }
  
        const prosumerBatteryDTO = prosumerBatteryOrError.getValue();
        return res.status(200).json(prosumerBatteryDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async getProsumerBattery(req: Request, res: Response, next: NextFunction) {
      try {
        const prosumerBatteryOrError = await this.prosumerBatteryServiceInstance.getProsumerBattery(req.params.id);
        
        if (prosumerBatteryOrError.isFailure) {
          return res.status(404).json({ message: prosumerBatteryOrError.error });
        }
  
        const prosumerBatteryDTO = prosumerBatteryOrError.getValue();
        return res.status(200).json(prosumerBatteryDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async findAll(req: Request, res: Response, next: NextFunction) {
      try {
        const prosumerBatteriesOrError = await this.prosumerBatteryServiceInstance.findAll() as Result<IBatteryDTO[]>;
        
        if (prosumerBatteriesOrError.isFailure) {
          return res.status(404).json({ message: prosumerBatteriesOrError.error });
        }
  
        const prosumerBatteriesDTO = prosumerBatteriesOrError.getValue();
        return res.status(200).json(prosumerBatteriesDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
}