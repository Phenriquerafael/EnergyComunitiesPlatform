import { Service } from "typedi";
import { Container } from "../container";
import config from "../../config";
import IProfileController from "./IControllers/IProfileController";
import IProfileService from "../services/IServices/IProfileService";
import { Request, Response, NextFunction } from "express";
import IProfileDTO from "../dto/IProfileDTO";
import { Result } from "../core/logic/Result";

@Service()
export default class ProfileController implements IProfileController {
  private get profileServiceInstance(): IProfileService {
    return Container.get(config.services.role.name) as IProfileService;
  }
  
  public async createProfile(req: Request, res: Response, next: NextFunction) {
      try {
        const profileOrError = await this.profileServiceInstance.createProfile(req.body);
        
        if (profileOrError.isFailure) {
          return res.status(400).json({ message: profileOrError.error });
        }

        const profileDTO = profileOrError.getValue();
        return res.status(201).json(profileDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
      }
  }
  public async updateProfile(req: Request, res: Response, next: NextFunction) {
      try {
        const profileOrError = await this.profileServiceInstance.updateProfile(req.body);
        
        if (profileOrError.isFailure) {
          return res.status(400).json({ message: profileOrError.error });
        }

        const profileDTO = profileOrError.getValue();
        return res.status(200).json(profileDTO);
      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async getProfile(req: Request, res: Response, next: NextFunction) {
      try {
        const profileOrError = await this.profileServiceInstance.getProfile(req.params.id);

        if (profileOrError.isFailure) {
          return res.status(404).json({ message: profileOrError.error });
        }

        const profileDTO = profileOrError.getValue();
        return res.status(200).json(profileDTO);

      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async findByProsumerId(req: Request, res: Response, next: NextFunction) {
      try {
        const profileOrError = await this.profileServiceInstance.findByProsumerId(req.params.userId);

        if (profileOrError.isFailure) {
          return res.status(404).json({ message: profileOrError.error });
        }

        const profileDTO = profileOrError.getValue();
        return res.status(200).json(profileDTO);

      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }
  public async findAll(req: Request, res: Response, next: NextFunction) {
      try {
        const profilesOrError = await this.profileServiceInstance.findAll() as Result<IProfileDTO[]>;
        
        if (profilesOrError.isFailure) {
          return res.status(404).json({ message: profilesOrError.error });
        }

        const profilesDTO = profilesOrError.getValue();
        return res.status(200).json(profilesDTO);

      } catch (error) {
        return next(error); // Pass error to Express error handler
        
      }
  }


}