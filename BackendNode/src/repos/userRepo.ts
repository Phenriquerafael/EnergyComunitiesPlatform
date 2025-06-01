import {Inject, Service} from 'typedi';
import prisma from '../../prisma/prismaClient';
import IUserRepo from "./IRepos/IUserRepo";
import {User} from '../domain/User/user';
import {UserId} from '../domain/User/userId';
import {UserEmail} from '../domain/User/userEmail';
import {UserMap} from '../mappers/UserMap';
import {PrismaClient} from '@prisma/client';

@Service()
export default class UserRepo implements IUserRepo {
  constructor(
      @Inject('prisma') private prisma: PrismaClient
  ) {
    /* console.log('RoleRepo instantiated'); // Debug */
  }

  public async exists(userId: UserId | string): Promise<boolean> {
    const id = userId instanceof UserId ? userId.id.toValue().toString() : userId;
    const user = await prisma.user.findUnique({
      where: { id: id.toString() },
    });
    return !!user;
  }

  public async save(user: User): Promise<User> {
    const id = user.id.toValue();
    const existing = await prisma.user.findUnique({
      where: { id: id.toString() },
    });

    const rawUser = UserMap.toPersistence(user);

    if (!existing) {
      const created = await prisma.user.create({ data: rawUser });
      return (await UserMap.toDomain(created)).getValue();
    } else {
      await prisma.user.update({
        where: { id: id.toString() },
        data: rawUser,
      });
      return user;
    }
  }

  public async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    const result: User[] = [];
    for (const user of users) {
      const domainUser = (await UserMap.toDomain(user)).getValue();
      result.push(domainUser);
    }
    return result;
  }


  public async findByEmail(email: UserEmail | string): Promise<User> {
    const emailStr = email.toString();
    const user = await prisma.user.findUnique({
      where: { email: emailStr },
    });
    const userResult = ((await UserMap.toDomain(user)).getValue()); 
    return userResult;
  }

  public async findById(userId: UserId | string): Promise<User> {
    const id = userId instanceof UserId ? userId.id.toValue() : userId;
    const user = await prisma.user.findUnique({
      where: { id: id.toString() },
    });
    const userResult = ((await UserMap.toDomain(user)).getValue());
    return userResult;
  }
  /*
    public async findByResetToken(token: string): Promise<User> {
      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date(),
          },
        },
      });
      return user ? UserMap.toDomain(user) : null;
    }
   */
  /*   public async findStaff(): Promise<User[]> {
      const staffRoleIds = [
        "22852d2a-646d-4c71-85f6-1605709f10e1",
        "fc01c9eb-a1da-4ded-96f5-9d1f97c8215b"
      ];
      const staff = await prisma.user.findMany({
        where: {
          roleId: { in: staffRoleIds },
        },
      });
      return staff.map(UserMap.toDomain);
    } */

  public async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id: id },
    });
  }

  public async findUnlinkedUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
            isActive: true,
            Prosumer: null,
            CommunityManager: null,
      },
    });
    const result: User[] = [];
    for (const user of users) {
      const domainUser = (await UserMap.toDomain(user)).getValue();
      result.push(domainUser);
    }
    return result;
  }
}
