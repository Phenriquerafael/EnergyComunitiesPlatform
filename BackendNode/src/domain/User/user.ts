import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";

import { UserEmail } from "./userEmail";


import { Guard } from "../../core/logic/Guard";
import { UserId } from "./userId";
import { UserPassword } from "./userPassword";
import { PhoneNumber } from "./phoneNumber";
import { Role } from "../Role/role";


interface UserProps {
  firstName: string;
  lastName: string;
  email: UserEmail;
  phoneNumber: PhoneNumber;
  password: UserPassword;
  role: Role;
  isEmailVerified: boolean;

}


export class User extends AggregateRoot<UserProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get userId (): UserId {
    return UserId.caller(this.id)
  }

  get email (): UserEmail {
    return this.props.email;
  }

  get phoneNumber (): PhoneNumber {
    return this.props.phoneNumber;
  }

  get firstName (): string {
    return this.props.firstName
  }

  get lastName (): string {
    return this.props.lastName;
  }

  get fullName (): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get password (): UserPassword {
    return this.props.password;
  }

  get role (): Role {
    return this.props.role;
  }
  
  set role (value: Role) {
      this.props.role = value;
  }

  get isEmailVerified (): boolean {
    return this.props.isEmailVerified;
  }

  set isEmailVerified (value: boolean) {
    this.props.isEmailVerified = value;
  }


  public updatePassword(newPassword: UserPassword): void {
    this.props.password = newPassword;
  }
  


  private constructor (props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardedProps = [
      { argument: props.firstName, argumentName: 'firstName' },
      { argument: props.lastName, argumentName: 'lastName' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.phoneNumber, argumentName: 'phoneNumber' },
      { argument: props.role, argumentName: 'role' },
      { argument: props.isEmailVerified, argumentName: 'isEmailVerified' }
    ];
  
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
  
    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    } else {
      const user = new User({ ...props }, id);
      return Result.ok<User>(user);
    }
  }

  public toString (): string {
    return `${this.firstName} ${this.lastName} - ${this.phoneNumber.value}\n${this.email.value}`;
  }
  
}