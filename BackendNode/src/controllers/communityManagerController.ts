import { Service } from "typedi";
import { Container } from "../container";
import config from "../../config";
import ICommunityManagerService from "../services/IServices/ICommunityManagerService";
import ICommunityManagerController from "./IControllers/ICommunityManagerController";
import { Request, Response, NextFunction } from "express";
import ICommunityManagerDTO from "../dto/ICommunityManagerDTO";
import { Result } from "../core/logic/Result";

@Service()
export default class CommunityManagerController implements ICommunityManagerController {
    private get communityManagerServiceInstance(): ICommunityManagerService {
        return Container.get(config.services.communityManager.name) as ICommunityManagerService;
    }

  public async createCommunityManager(req: Request, res: Response, next: NextFunction) {
        try {
            const communityManagerOrError = await this.communityManagerServiceInstance.createCommunityManager(req.body);
            
            if (communityManagerOrError.isFailure) {
            return res.status(400).json({ message: communityManagerOrError.error });
            }
    
            const communityManagerDTO = communityManagerOrError.getValue();
            return res.status(201).json(communityManagerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async updateCommunityManager(req: Request, res: Response, next: NextFunction) {
        try {
            const communityManagerOrError = await this.communityManagerServiceInstance.updateCommunityManager(req.body);
            
            if (communityManagerOrError.isFailure) {
            return res.status(400).json({ message: communityManagerOrError.error });
            }
    
            const communityManagerDTO = communityManagerOrError.getValue();
            return res.status(200).json(communityManagerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async getCommunityManager(req: Request, res: Response, next: NextFunction) {
        try {
            const communityManagerOrError = await this.communityManagerServiceInstance.getCommunityManager(req.params.id);
            
            if (communityManagerOrError.isFailure) {
            return res.status(404).json({ message: communityManagerOrError.error });
            }
    
            const communityManagerDTO = communityManagerOrError.getValue();
            return res.status(200).json(communityManagerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async findByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            
            const communityManagerOrError = await this.communityManagerServiceInstance.findByUserId(req.params.id);
            
            if (communityManagerOrError.isFailure) {
            return res.status(404).json({ message: communityManagerOrError.error });
            }
    
            const communityManagerDTO = communityManagerOrError.getValue();
            return res.status(200).json(communityManagerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async findByCommunityId(req: Request, res: Response, next: NextFunction) {
        try {
            const communityManagerOrError = await this.communityManagerServiceInstance.findByCommunityId(req.params.communityId);
            
            if (communityManagerOrError.isFailure) {
            return res.status(404).json({ message: communityManagerOrError.error });
            }
    
            const communityManagerDTO = communityManagerOrError.getValue();
            return res.status(200).json(communityManagerDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }
  public async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const communityManagersOrError = await this.communityManagerServiceInstance.findAll() as Result<ICommunityManagerDTO[]>;
            
            if (communityManagersOrError.isFailure) {
            return res.status(404).json({ message: communityManagersOrError.error });
            }
    
            const communityManagersDTO = communityManagersOrError.getValue();
            return res.status(200).json(communityManagersDTO);
        } catch (error) {
            return next(error); // Pass error to Express error handler
        }
  }

}