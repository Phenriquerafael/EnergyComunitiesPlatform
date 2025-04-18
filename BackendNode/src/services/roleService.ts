import { Service, Inject } from 'typedi';
import config from '../../config';
import IRoleDTO from '../dto/IRoleDTO';
import IRoleRepo from '../repos/IRepos/IRoleRepo';
import IRoleService from './IServices/IRoleService';
import { Result } from '../core/logic/Result';
import { RoleMap } from '../mappers/RoleMap';
import { Role } from '../domain/Role/role';
import { RoleEnum } from '../domain/Role/roleEnum';

@Service()
export default class RoleService implements IRoleService {
  constructor(
    @Inject(config.repos.role.name) private roleRepo: IRoleRepo
  ) {
    /* console.log('RoleService instantiated'); // Debug */
    }

  public async findByName(roleName: string): Promise<Result<IRoleDTO>> {
    try {
      const role = await this.roleRepo.findByName(roleName);
      if (role === null) {
        return Result.fail<IRoleDTO>('Role not found');
      }
      const roleDTOResult = RoleMap.toDTO(role) as IRoleDTO;
      return Result.ok<IRoleDTO>(roleDTOResult);
    } catch (e) {
      if (e instanceof Error && e.name === 'PrismaClientKnownRequestError' && (e as any).code === 'P2002') {
        return Result.fail<IRoleDTO>('Unique constraint violation');
      }
      return Result.fail<IRoleDTO>('Error while finding role: ' + e.message);
    }
  }

  public async findAll(): Promise<Result<IRoleDTO[]>> {
    try {
      const roles = await this.roleRepo.findAll();
      if (!roles || roles.length === 0) {
        return Result.fail<IRoleDTO[]>('No roles found');
      }
      const roleDTOResult = roles.map(role => RoleMap.toDTO(role) as IRoleDTO);
      return Result.ok<IRoleDTO[]>(roleDTOResult);
    } catch (e) {
      return Result.fail<IRoleDTO[]>('Error while finding roles: ' + e.message);
    }
  }

  public async getRole(roleId: string): Promise<Result<IRoleDTO>> {
    try {
      const role = await this.roleRepo.findByDomainId(roleId);
      if (role === null) {
        return Result.fail<IRoleDTO>('Role not found');
      }
      const roleDTOResult = RoleMap.toDTO(role) as IRoleDTO;
      return Result.ok<IRoleDTO>(roleDTOResult);
    } catch (e) {
      return Result.fail<IRoleDTO>('Error while finding role: ' + e.message);
    }
  }

  public async createRole(roleDTO: IRoleDTO): Promise<Result<IRoleDTO>> {
    try {
      const roleOrError = await Role.create(roleDTO);
      if (roleOrError.isFailure) {
        return Result.fail<IRoleDTO>(roleOrError.errorValue());
      }

      const roleResult = roleOrError.getValue();
      await this.roleRepo.save(roleResult);

      const roleDTOResult = RoleMap.toDTO(roleResult) as IRoleDTO;
      return Result.ok<IRoleDTO>(roleDTOResult);
    } catch (e) {
      if (e instanceof Error && e.name === 'PrismaClientKnownRequestError' && (e as any).code === 'P2002') {
        return Result.fail<IRoleDTO>('A role with this name or domainId already exists');
      }
      return Result.fail<IRoleDTO>('Error while creating role: ' + e.message);
    }
  }

  public async updateRole(roleDTO: IRoleDTO): Promise<Result<IRoleDTO>> {
    try {
      const role = await this.roleRepo.findByDomainId(roleDTO.id);
      if (role === null) {
        return Result.fail<IRoleDTO>('Role not found');
      }

      // Validate RoleEnum mapping
      const roleName = RoleEnum[roleDTO.name];
      if (!roleName) {
        return Result.fail<IRoleDTO>('Invalid role name: ' + roleDTO.name);
      }

      role.name = roleName;
      await this.roleRepo.save(role);

      const roleDTOResult = RoleMap.toDTO(role) as IRoleDTO;
      return Result.ok<IRoleDTO>(roleDTOResult);
    } catch (e) {
      if (e instanceof Error && e.name === 'PrismaClientKnownRequestError' && (e as any).code === 'P2002') {
        return Result.fail<IRoleDTO>('A role with this name already exists');
      }
      return Result.fail<IRoleDTO>('Error while updating role: ' + e.message);
    }
  }
}