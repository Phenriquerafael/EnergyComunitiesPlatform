import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';
import IRoleController from './IControllers/IRoleController';
import IRoleService from '../services/IServices/IRoleService';
import IRoleDTO from '../dto/IRoleDTO';
import { Result } from '../core/logic/Result';

@Service()
export default class RoleController implements IRoleController {
  constructor(
    @Inject(config.services.role.name) private roleServiceInstance: IRoleService
  ) {}

  public async getRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleOrError = await this.roleServiceInstance.getRole(req.params.id) as Result<IRoleDTO>;
      
      if (roleOrError.isFailure) {
        return res.status(404).json({ message: roleOrError.error });
      }

      const roleDTO = roleOrError.getValue();
      return res.status(200).json(roleDTO);
    } catch (error) {
      return next(error); // Pass error to Express error handler
    }
  }

  public async findByName(req: Request, res: Response, next: NextFunction) {
    try {
      const roleOrError = await this.roleServiceInstance.findByName(req.params.name) as Result<IRoleDTO>;
      
      if (roleOrError.isFailure) {
        return res.status(404).json({ message: roleOrError.error });
      }

      const roleDTO = roleOrError.getValue();
      return res.status(200).json(roleDTO);
    } catch (error) {
      return next(error); // Pass error to Express error handler
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const rolesOrError = await this.roleServiceInstance.findAll() as Result<IRoleDTO[]>;
      
      if (rolesOrError.isFailure) {
        return res.status(404).json({ message: rolesOrError.error });
      }

      const rolesDTO = rolesOrError.getValue();
      return res.status(200).json(rolesDTO);
    } catch (error) {
      return next(error); // Pass error to Express error handler
    }
  }

  public async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleOrError = await this.roleServiceInstance.createRole(req.body as IRoleDTO) as Result<IRoleDTO>;
        
      if (roleOrError.isFailure) {
        return res.status(400).json({ message: roleOrError.error }); // Use 400 for bad request
      }

      const roleDTO = roleOrError.getValue();
      return res.status(201).json(roleDTO);
    } catch (error) {
      return next(error);
    }
  }

  public async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleOrError = await this.roleServiceInstance.updateRole(req.body as IRoleDTO) as Result<IRoleDTO>;

      if (roleOrError.isFailure) {
        return res.status(404).json({ message: roleOrError.error });
      }

      const roleDTO = roleOrError.getValue();
      return res.status(200).json(roleDTO); // Use 200 for successful update
    } catch (error) {
      return next(error);
    }
  }
}