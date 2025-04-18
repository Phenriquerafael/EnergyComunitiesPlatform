import { Request, Response, NextFunction } from "express";
import { Container } from "../container";
import IBatteryController from "./IControllers/IProsumerBatteryController";
import IBatteryService from "../services/IServices/IProsumerBatteryService";
import config from "../../config";
import { Service } from "typedi";
import { Result } from "../core/logic/Result";
import IBatteryDTO from "../dto/IBatteryDTO";

@Service()
export default class BatteryController implements IBatteryController {

  private get batteryServiceInstance(): IBatteryService {
    return Container.get(config.services.battery.name) as IBatteryService;
  }  
  
  public async createBattery(req: Request, res: Response, next: NextFunction) {
      try {
        const prosumerBatteryOrError = await this.batteryServiceInstance.createBattery(req.body);
        
        if (prosumerBatteryOrError.isFailure) {
          return res.status(400).json({ message: prosumerBatteryOrError.error });
        }
  
        const prosumerBatteryDTO = prosumerBatteryOrError.getValue();
        return res.status(201).json(prosumerBatteryDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async updateBattery(req: Request, res: Response, next: NextFunction) {
      try {
        const prosumerBatteryOrError = await this.batteryServiceInstance.updateBattery(req.body);
        
        if (prosumerBatteryOrError.isFailure) {
          return res.status(400).json({ message: prosumerBatteryOrError.error });
        }
  
        const prosumerBatteryDTO = prosumerBatteryOrError.getValue();
        return res.status(200).json(prosumerBatteryDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async getBattery(req: Request, res: Response, next: NextFunction) {
      try {
        const prosumerBatteryOrError = await this.batteryServiceInstance.getBattery(req.params.id);
        
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
        const prosumerBatteriesOrError = await this.batteryServiceInstance.findAll() as Result<IBatteryDTO[]>;
        
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