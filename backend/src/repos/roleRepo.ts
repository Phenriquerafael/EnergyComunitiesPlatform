import { Service, Inject } from 'typedi';

import IRoleRepo from "../services/IRepos/IRoleRepo";

import { RoleMap } from "../mappers/RoleMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IRolePersistence } from '../dataschema/IRolePersistence';
import { Role } from '../domain/Role/role';
import { RoleId } from '../domain/Role/roleId';

@Service()
export default class RoleRepo implements IRoleRepo {
  private models: any;

  constructor(
    @Inject('roleSchema') private roleSchema : Model<IRolePersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async findByName(roleName: string): Promise<Role> {
    try {
      const query = { name: roleName };
      const roleRecord = await this.roleSchema.findOne(query as FilterQuery<IRolePersistence & Document>);
      return RoleMap.toDomain(roleRecord);

    } catch (error) {

      throw new Error("Role not found:"+ error);
    }
  }
  public async findAll(): Promise<Role[]> {
    try {
      const roleRecord = await this.roleSchema.find();
      return roleRecord.map((role) => RoleMap.toDomain(role));
    } catch (error) {
      throw new Error("Role not found:"+ error);
    }
  }

  public async exists(role: Role): Promise<boolean> {
    
    const idX = role.id instanceof RoleId ? (<RoleId>role.id).toValue() : role.id;

    const query = { domainId: idX}; 
    const roleDocument = await this.roleSchema.findOne( query as FilterQuery<IRolePersistence & Document>);

    return !!roleDocument === true;
  }

  public async save (role: Role): Promise<Role> {
    const query = { domainId: role.id.toString()}; 

    const roleDocument = await this.roleSchema.findOne( query );

    try {
      if (roleDocument === null ) {
        const rawRole: any = RoleMap.toPersistence(role);

        const roleCreated = await this.roleSchema.create(rawRole);

        return RoleMap.toDomain(roleCreated);
      } else {
        roleDocument.name = role.name;
        await roleDocument.save();

        return role;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (roleId: RoleId | string): Promise<Role> {
    const query = { domainId: roleId};
    const roleRecord = await this.roleSchema.findOne( query as FilterQuery<IRolePersistence & Document> );

    if( roleRecord != null) {
      return RoleMap.toDomain(roleRecord);
    }
    else
      throw new Error('Role not found');
  }
}