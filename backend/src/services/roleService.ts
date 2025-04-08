import { Service, Inject } from 'typedi';
import config from "../../config";
import IRoleDTO from '../dto/IRoleDTO';

import IRoleRepo from '../services/IRepos/IRoleRepo';
import IRoleService from './IServices/IRoleService';
import { Result } from "../core/logic/Result";
import { RoleMap } from "../mappers/RoleMap";
import { Role } from '../domain/Role/role';
import { RoleEnum } from '../domain/Role/roleEnum';


@Service()
export default class RoleService implements IRoleService {
  constructor(
      @Inject(config.repos.role.name) private roleRepo : IRoleRepo
  ) {}

  public async findByName(roleName: string): Promise<Result<IRoleDTO>> {
    try {
      const role = await this.roleRepo.findByName(roleName);

      if (role === null) {
        return Result.fail<IRoleDTO>("Role not found");
      }
      else {
        const roleDTOResult = RoleMap.toDTO( role ) as IRoleDTO;
        return Result.ok<IRoleDTO>( roleDTOResult )
      }
    } catch (e) {
      throw new Error("Role not found:"+ e);
    }
  }

  public async findAll(): Promise<Result<IRoleDTO[]>> {
    try {
      const roles = await this.roleRepo.findAll();

      if (roles === null) {
        return Result.fail<IRoleDTO[]>("Role not found");
      }
      else {
        const roleDTOResult = roles.map( role => RoleMap.toDTO( role ) as IRoleDTO );
        return Result.ok<IRoleDTO[]>( roleDTOResult )
      }
    } catch (error) {
      throw new Error("Role not found:"+ error);
      
    }
  }

  public async getRole( roleId: string): Promise<Result<IRoleDTO>> {
    try {
      const role = await this.roleRepo.findByDomainId(roleId);

      if (role === null) {
        return Result.fail<IRoleDTO>("Role not found");
      }
      else {
        const roleDTOResult = RoleMap.toDTO( role ) as IRoleDTO;
        return Result.ok<IRoleDTO>( roleDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }


  public async createRole(roleDTO: IRoleDTO): Promise<Result<IRoleDTO>> {
    try {

      const roleOrError = await Role.create( roleDTO );

      if (roleOrError.isFailure) {
        return Result.fail<IRoleDTO>(roleOrError.errorValue());
      }

      const roleResult = roleOrError.getValue();

      await this.roleRepo.save(roleResult);

      const roleDTOResult = RoleMap.toDTO( roleResult ) as IRoleDTO;
      return Result.ok<IRoleDTO>( roleDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async updateRole(roleDTO: IRoleDTO): Promise<Result<IRoleDTO>> {
    try {
      const role = await this.roleRepo.findByDomainId(roleDTO.id);

      if (role === null) {
        return Result.fail<IRoleDTO>("Role not found");
      }
      else {
        role.name = RoleEnum[roleDTO.name];
        await this.roleRepo.save(role);

        const roleDTOResult = RoleMap.toDTO( role ) as IRoleDTO;
        return Result.ok<IRoleDTO>( roleDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
