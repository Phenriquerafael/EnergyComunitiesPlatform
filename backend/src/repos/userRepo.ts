import { Service, Inject } from 'typedi';
import { Document, Model } from 'mongoose';
import { IUserPersistence } from '../dataschema/IUserPersistence';
import IUserRepo from "../services/IRepos/IUserRepo";

import { UserMap } from "../mappers/UserMap";
import { UserId } from '../domain/User/userId';
import { User } from '../domain/User/user';
import { UserEmail } from '../domain/User/userEmail';

@Service()
export default class UserRepo implements IUserRepo {
  constructor(
    @Inject('userSchema') private userSchema: Model<IUserPersistence & Document>,
    @Inject('logger') private logger
  ) {}

  public async exists(userId: UserId | string): Promise<boolean> {
    const idX = userId instanceof UserId ? (<UserId>userId).id.toValue() : userId;
    const query = { domainId: idX };
    const userDocument = await this.userSchema.findOne(query);
    return !!userDocument === true;
  }

  public async save(user: User): Promise<User> {
    const query = { domainId: user.id.toString() };
    const userDocument = await this.userSchema.findOne(query);

    try {
      if (userDocument === null) {
        const rawUser: any = UserMap.toPersistence(user);
        const userCreated = await this.userSchema.create(rawUser);
        return UserMap.toDomain(userCreated);
      } else {
        userDocument.firstName = user.firstName;
        userDocument.lastName = user.lastName;
        userDocument.email = user.email.value;
        userDocument.phoneNumber = user.phoneNumber.value;
        userDocument.password = user.password.value;
        userDocument.role = user.role.id.toString();
        userDocument.isEmailVerified = user.isEmailVerified;
        
/*        userDocument.passwordResetToken = user.passwordResetToken;
        userDocument.passwordResetExpires = user.passwordResetExpires; */
        await userDocument.save();
        return user;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByEmail(email: UserEmail | string): Promise<User> {
    const query = { email: email.toString() };
    const userRecord = await this.userSchema.findOne(query);
    return userRecord ? UserMap.toDomain(userRecord) : null;
  }

  public async findByID(userId: UserId | string): Promise<User> {
    const idX = userId instanceof UserId ? (<UserId>userId).id.toValue() : userId;
    const query = { domainId: idX };
    const userRecord = await this.userSchema.findOne(query);
    return userRecord ? UserMap.toDomain(userRecord) : null;
  }

  public async findByResetToken(token: string): Promise<User> {
    const query = { passwordResetToken: token, passwordResetExpires: { $gt: new Date() } };
    const userRecord = await this.userSchema.findOne(query);
    return userRecord ? UserMap.toDomain(userRecord) : null;
  }

  //por corrigir
  public async findStaff(): Promise<User[]> {
    const query = { role: { $in: ["22852d2a-646d-4c71-85f6-1605709f10e1", "fc01c9eb-a1da-4ded-96f5-9d1f97c8215b"] } };
    const userRecords = await this.userSchema.find(query);
    const users = await Promise.all(userRecords.map((userRecord) => UserMap.toDomain(userRecord)));
    return users;
  }

  public async delete(id: string): Promise<void> {
    const query = { domainId: id };
    await this.userSchema.deleteOne(query);
}
}
