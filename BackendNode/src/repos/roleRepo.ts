import { Inject, Service } from 'typedi';
import prisma from '../../prisma/prismaClient';
import IRoleRepo from "./IRepos/IRoleRepo";
import { Role } from '../domain/Role/role';
import { RoleId } from '../domain/Role/roleId';
import { RoleMap } from '../mappers/RoleMap';
import { PrismaClient } from '@prisma/client';

@Service()
export default class RoleRepo implements IRoleRepo {
  constructor(
    @Inject('prisma') private prisma: PrismaClient
  ) {
    /* console.log('RoleRepo instantiated'); // Debug */
  }


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
      where: { id: String(id) },
    });
    return !!exists;
  }

  public async save(role: Role): Promise<Role> {
    const id = role.id.toValue();
    const existing = await prisma.role.findUnique({
      where: { id: String(id) },
    });

    const rawRole = RoleMap.toPersistence(role);

    if (!existing) {
      const created = await prisma.role.create({
        data: rawRole,
      });
      return RoleMap.toDomain(created);
    } else {
      await prisma.role.update({
        where: { id: String(id) },
        data: rawRole,
      });
      return role;
    }
  }

  public async findByDomainId(roleId: RoleId | string): Promise<Role> {
    const id = roleId instanceof RoleId ? roleId.toValue() : roleId;
    const role = await prisma.role.findUnique({
      where: { id: String(id) },
    });
    if (!role) throw new Error("Role not found");
    return RoleMap.toDomain(role);
  }
}
