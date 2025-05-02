import { Container } from 'typedi';

import { Mapper } from "../core/infra/Mapper";

import {IUserDTO} from "../dto/IUserDTO";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";




import RoleRepo from "../repos/roleRepo";
import { User } from '../domain/User/user';
import { UserEmail } from '../domain/User/userEmail';
import { PhoneNumber } from '../domain/User/phoneNumber';
import { UserPassword } from '../domain/User/userPassword';
import { Result } from '../core/logic/Result';


export class UserMap extends Mapper<User> {

  public static toDTO( user: User): IUserDTO {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.value,
      phoneNumber: user.phoneNumber.value,
      password: "",
      role: user.role.id.toString(),
      isActive: user.isActive
    } as IUserDTO;
  }

  public static async toDomain (raw: any): Promise<Result<User>> {
    const userEmailOrError = UserEmail.create(raw.email);
    const phoneNumberOrError = PhoneNumber.create(raw.phoneNumber);
    const userPasswordOrError = UserPassword.create({value: raw.password, hashed: true});
    const repo = Container.get(RoleRepo);
    const role = await repo.findByDomainId(raw.roleId);

    const userOrError = User.create({
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: userEmailOrError.getValue(),
      phoneNumber: phoneNumberOrError.getValue(),
      password: userPasswordOrError.getValue(),
      role: role,
      isActive: raw.isActive
    }, new UniqueEntityID(raw.id))

    if (userOrError.isFailure) {
      return Result.fail<User>(userOrError.errorValue());
    }
    
    return userOrError;
  }

  public static toPersistence(user: User): any {
    return {
      /* domainId: user.id.toString(), */
      id: user.id.toString(),
      email: user.email.value,
      phoneNumber: user.phoneNumber.value,
      password: user.password.value,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.role ? user.role.id.toValue() : null, // Use roleId instead of role
      isActive: user.isActive
    };
  }
}