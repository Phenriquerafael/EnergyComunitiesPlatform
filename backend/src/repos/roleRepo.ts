import { Service } from 'typedi';
import prisma from '../../prisma/prismaClient';
import IRoleRepo from "../services/IRepos/IRoleRepo";
import { Role } from '../domain/Role/role';
import { RoleId } from '../domain/Role/roleId';
import { RoleMap } from '../mappers/RoleMap';

@Service()
export default class RoleRepo implements IRoleRepo {

  public async findByName(roleName: string): Promise<Role> {
    const roleRecord = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!roleRecord) throw new Error("Role not found");
    return RoleMap.toDomain(roleRecord);
  }

  public async findAll(): Promise<Role[]> {
    const roleRecords = await prisma.role.findMany();
    return roleRecords.map(role => RoleMap.toDomain(role));
  }

  public async exists(role: Role): Promise<boolean> {
    const id = role.id instanceof RoleId ? role.id.toValue() : role.id;
    const exists = await prisma.role.findUnique({
      where: { domainId: id },
    });
    return !!exists;
  }

  public async save(role: Role): Promise<Role> {
    const id = role.id.toValue();
    const existing = await prisma.role.findUnique({
      where: { domainId: id },
    });

    const rawRole = RoleMap.toPersistence(role);

    if (!existing) {
      const created = await prisma.role.create({
        data: rawRole,
      });
      return RoleMap.toDomain(created);
    } else {
      await prisma.role.update({
        where: { domainId: id },
        data: rawRole,
      });
      return role;
    }
  }

  public async findByDomainId(roleId: RoleId | string): Promise<Role> {
    const id = roleId instanceof RoleId ? roleId.toValue() : roleId;
    const role = await prisma.role.findUnique({
      where: { domainId: id },
    });
    if (!role) throw new Error("Role not found");
    return RoleMap.toDomain(role);
  }
}
