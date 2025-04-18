import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IRolePersistence } from '../dataschema/IRolePersistence';

import IRoleDTO from "../dto/IRoleDTO";


import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Role } from "../domain/Role/role";

export class RoleMap extends Mapper<Role> {
  
  public static toDTO( role: Role): IRoleDTO {
    return {
      id: role.id.toString(),
      name: role.name,
    } as IRoleDTO;
  }

  public static toDomain (role: any | Model<IRolePersistence & Document> ): Role {
    const roleOrError = Role.create(
      role,
      new UniqueEntityID(role.id)
    );

    roleOrError.isFailure ? console.log(roleOrError.error) : '';

    return roleOrError.isSuccess ? roleOrError.getValue() : null;
  }

  public static toPersistence (role: Role): any {
    return {
      id: role.id.toString(),
      name: role.name
    }
  }
}