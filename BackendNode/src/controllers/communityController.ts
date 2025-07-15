import { Request, Response, NextFunction } from "express";
import { Container } from "../container";
import ICommunityController from "./IControllers/ICommunityController";
import ICommunityService from "../services/IServices/ICommunityService";
import config from "../../config";
import { Service } from "typedi";
import { Result } from "../core/logic/Result";
import ICommunityDTO from "../dto/ICommunityDTO";

@Service()
export default class CommunityController implements ICommunityController {

  private get communityServiceInstance(): ICommunityService {
    return Container.get(config.services.community.name) as ICommunityService;
  }  
  
  public async createCommunity(req: Request, res: Response, next: NextFunction) {
      try {
        const communityOrError = await this.communityServiceInstance.createCommunity(req.body);
        
        if (communityOrError.isFailure) {
          return res.status(400).json({ message: communityOrError.error });
        }
  
        const communityDTO = communityOrError.getValue();
        return res.status(201).json(communityDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async updateCommunity(req: Request, res: Response, next: NextFunction) {
      try {
        const communityOrError = await this.communityServiceInstance.updateCommunity(req.body);
        
        if (communityOrError.isFailure) {
          return res.status(400).json({ message: communityOrError.error });
        }
  
        const communityDTO = communityOrError.getValue();
        return res.status(200).json(communityDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async getCommunity(req: Request, res: Response, next: NextFunction) {
      try {
        const communityOrError = await this.communityServiceInstance.getCommunity(req.params.id);
        
        if (communityOrError.isFailure) {
          return res.status(404).json({ message: communityOrError.error });
        }
  
        const communityDTO = communityOrError.getValue();
        return res.status(200).json(communityDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async findAll(req: Request, res: Response, next: NextFunction) {
      try {
        const communitiesOrError = await this.communityServiceInstance.findAll() as Result<ICommunityDTO[]>;
        
        if (communitiesOrError.isFailure) {
          return res.status(404).json({ message: communitiesOrError.error });
        }
  
        const communitiesDTO = communitiesOrError.getValue();
        return res.status(200).json(communitiesDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }

  public async deleteCommunity(req: Request, res: Response, next: NextFunction) {
      try {
        const deleteResult = await this.communityServiceInstance.deleteCommunity(req.params.id);
        
        if (deleteResult.isFailure) {
          return res.status(404).json({ message: deleteResult.error });
        }
  
        return res.status(204).send(); // No content
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }

  


}