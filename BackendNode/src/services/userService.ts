import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../../config';
import argon2 from 'argon2';
import IUserService from '../services/IServices/IUserService';
import { UserMap } from '../mappers/UserMap';
import { IUserDTO } from '../dto/IUserDTO';
import IUserRepo from '../repos/IRepos/IUserRepo';
import IRoleRepo from '../repos/IRepos/IRoleRepo';
import { Result } from '../core/logic/Result';
import { UserPassword } from '../domain/User/userPassword';
import { UserEmail } from '../domain/User/userEmail';
import { PhoneNumber } from '../domain/User/phoneNumber';
import { Role } from '../domain/Role/role';
import { User } from '../domain/User/user';

@Service()
export default class UserService implements IUserService {
  private revokedTokens = new Set<string>();

  constructor(
    @Inject(config.repos.user.name) private userRepo: IUserRepo,
    @Inject(config.repos.role.name) private roleRepo: IRoleRepo,
    @Inject('logger') private logger
  ) {
    console.log('UserService instantiated'); // Debug
  }

  public async isAdmin(id: string): Promise<Result<boolean>> {
    try {
      const user = await this.userRepo.findByID(id);
      if (!user) {
        return Result.fail<boolean>('User not found');
      }
      const roleId = user.role?.id.toString();
      if (!roleId) {
        return Result.fail<boolean>('User role not found');
      }
      const role = await this.roleRepo.findByDomainId(roleId);
      if (!role) {
        return Result.fail<boolean>('Role not found');
      }
      return Result.ok<boolean>(role.name === 'Admin' || role.name === 'ADMIN');
    } catch (error) {
      return Result.fail<boolean>('Error while checking if user is admin: ' + error.message);
    }
  }

  public async findStaff(): Promise<Result<IUserDTO[]>> {
/*     try {
      const staff = await this.userRepo.findStaff();
      if (!staff || staff.length === 0) {
        return Result.fail<IUserDTO[]>('No staff found');
      }
      return Result.ok<IUserDTO[]>(staff.map(staff => UserMap.toDTO(staff) as IUserDTO));
    } catch (error) {
      return Result.fail<IUserDTO[]>('Error while finding staff: ' + error.message);
    } */
   throw new Error('Not implemented yet');
  }

  public async getUser(id: string): Promise<Result<IUserDTO>> {
    try {
      const user = await this.userRepo.findByID(id);
      if (!user) {
        return Result.fail<IUserDTO>('User not found');
      }
      return Result.ok<IUserDTO>(UserMap.toDTO(user) as IUserDTO);
    } catch (error) {
      return Result.fail<IUserDTO>('Error while finding user: ' + error.message);
    }
  }

  public async confirmAccount(token: string): Promise<Result<void>> {
    try {
      const payload = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await this.userRepo.findByID(payload.id);
      if (!user) {
        return Result.fail<void>('User not found');
      }
      user.isEmailVerified = true;
      await this.userRepo.save(user);
      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Error confirming account: ' + error.message);
    }
  }

  public async SignUp(userDTO: IUserDTO): Promise<Result<{ userDTO: IUserDTO, token: string }>> {
    try {
/*       const userDocument = await this.userRepo.findByEmail(userDTO.email);
      if (userDocument) {
        return Result.fail<{ userDTO: IUserDTO, token: string }>('User already exists: ' + userDTO.email);
      } */

      if (!userDTO.email || !userDTO.password || !userDTO.firstName || !userDTO.lastName) {
        return Result.fail<{ userDTO: IUserDTO, token: string }>('Missing required fields');
      }

      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userDTO.password);
      this.logger.silly('Creating user db record');

      const password = await UserPassword.create({ value: hashedPassword, hashed: true }).getValue();
      const email = await UserEmail.create(userDTO.email).getValue();
      const phoneNumber = await PhoneNumber.create(userDTO.phoneNumber).getValue();

      let role: Role;
      const roleOrError = await this.getRole(userDTO.role);
      if (roleOrError.isFailure) {
        this.logger.silly('Setting default role: Client');
        const defaultRole = await this.roleRepo.findByName('Client');
        if (!defaultRole) {
          return Result.fail<{ userDTO: IUserDTO, token: string }>('Default role "Client" not found');
        }
        role = defaultRole;
      } else {
        role = roleOrError.getValue();
      }

      const userOrError = await User.create({
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        email: email,
        phoneNumber: phoneNumber,
        role: role,
        password: password,
        //isEmailVerified: false, 
        // Uncomment this line if you want to set isEmailVerified to false by default
        isEmailVerified: true,
      });

      if (userOrError.isFailure) {
        return Result.fail<{ userDTO: IUserDTO, token: string }>(userOrError.errorValue());
      }

      const userResult = userOrError.getValue();
      const token = this.generateConfirmationToken(userResult.id.toString());

      this.logger.silly('Sending confirmation email');
      const emailResult = Result.ok<void>(); // Replace with actual mailer service call

      if (emailResult.isSuccess) {
        await this.userRepo.save(userResult);
        this.DeleteUnconfirmedUser(userResult);
        const userDTOResult = UserMap.toDTO(userResult) as IUserDTO;
        return Result.ok<{ userDTO: IUserDTO, token: string }>({ userDTO: userDTOResult, token });
      } else {
        return Result.fail<{ userDTO: IUserDTO, token: string }>('Failed to send welcome email');
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'PrismaClientKnownRequestError' && 'code' in e && e.code === 'P2002') {
        return Result.fail<{ userDTO: IUserDTO, token: string }>('A user with this email or domainId already exists');
      }
      this.logger.error(e);
      return Result.fail<{ userDTO: IUserDTO, token: string }>('Error while signing up: ' + e.message);
    }
  }

  public async DeleteUnconfirmedUser(user: User): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 5)); // 5 minutes
      const currentUser = await this.userRepo.findByID(user.id.toString());
      if (!currentUser) {
        this.logger.silly('User already deleted');
        return;
      }
      if (currentUser.isEmailVerified) {
        this.logger.silly('User is verified');
        return;
      }
      this.logger.silly('Deleting unconfirmed user');
      await this.userRepo.delete(user.id.toString());
    } catch (error) {
      this.logger.error('Error deleting unconfirmed user: ' + error.message);
    }
  }

  public async SignIn(email: string, password: string): Promise<Result<{ userDTO: IUserDTO, token: string }>> {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        return Result.fail<{ userDTO: IUserDTO, token: string }>('User not registered');
      }

      if (!user.isEmailVerified) {
        return Result.fail<{ userDTO: IUserDTO, token: string }>('Email not confirmed');
      }

      this.logger.silly('Checking password');
      const validPassword = await argon2.verify(user.password.value, password);
      if (!validPassword) {
        return Result.fail<{ userDTO: IUserDTO, token: string }>('Invalid Password');
      }

      this.logger.silly('Generating JWT');
      const token = this.generateToken(user);
      const userDTO = UserMap.toDTO(user) as IUserDTO;
      return Result.ok<{ userDTO: IUserDTO, token: string }>({ userDTO, token });
    } catch (error) {
      return Result.fail<{ userDTO: IUserDTO, token: string }>('Error while signing in: ' + error.message);
    }
  }

  public async SignOut(token: string): Promise<Result<void>> {
    try {
      this.logger.silly(`Revoking token: ${token}`);
      this.revokedTokens.add(token);
      return Result.ok<void>();
    } catch (error) {
      this.logger.error(error);
      return Result.fail<void>('Error during sign out: ' + error.message);
    }
  }

  public isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  private generateConfirmationToken(id: string): string {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: '6m' });
  }

  private generateToken(user: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 7);

    const id = user.id.toString();
    const email = user.email.value;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const role = user.role?.id.toString();

    return jwt.sign(
      {
        id,
        email,
        role,
        firstName,
        lastName,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }

  private async getRole(roleId: string): Promise<Result<Role>> {
    try {
      const role = await this.roleRepo.findByDomainId(roleId);
      if (!role) {
        return Result.fail<Role>('Couldn’t find role by id=' + roleId);
      }
      return Result.ok<Role>(role);
    } catch (error) {
      return Result.fail<Role>('Error while finding role: ' + error.message);
    }
  }

  public async ForgotPassword(email: string): Promise<Result<string>> {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        return Result.fail<string>('User not found');
      }

      const resetToken = this.generateConfirmationToken(user.id.toString());
      // Uncomment and implement mailer service if needed
      // await this.mailerService.sendPasswordResetEmail(email, resetToken);
      return Result.ok<string>('Password reset link sent');
    } catch (error) {
      this.logger.error(error);
      return Result.fail<string>('Error processing password reset: ' + error.message);
    }
  }

  public async ResetPassword(token: string, newPassword: string): Promise<Result<string>> {
    try {
      const payload = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await this.userRepo.findByID(payload.id);
      if (!user) {
        return Result.fail<string>('Invalid or expired reset token');
      }

      const hashedPassword = await argon2.hash(newPassword);
      const hashedUserPassword = await UserPassword.create({ value: hashedPassword, hashed: true }).getValue();
      user.updatePassword(hashedUserPassword);
      await this.userRepo.save(user);

      return Result.ok<string>('Password successfully reset');
    } catch (error) {
      this.logger.error(error);
      return Result.fail<string>('Error resetting password: ' + error.message);
    }
  }
}