import e, { Response, Request, NextFunction } from 'express';

import { Container, Inject, Service} from 'typedi';

import config from '../../config';

import IUserRepo from '../services/IRepos/IUserRepo';

import { UserMap } from "../mappers/UserMap";
import { IUserDTO } from '../dto/IUserDTO';
import IUserService from '../services/IServices/IUserService';
import IUserController from './IControllers/IUserController';



/**Adicionar validação de erros:
  Node Auth Tutorial (JWT) #5 - Mongoose Validation
 */
    
    @Service()
    export default class UserController implements IUserController {
      constructor(
        @Inject(config.services.user.name) private userService: IUserService
      ) {}

      public async isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
          const result = await this.userService.isAdmin(req.params.id);
          if (result.isFailure) {
            return res.status(400).json({ message: result.error });
          }
          return res.status(200).json(result.getValue());
        } catch (error) {
          next(error);
        }
      }


      public async findStaff(req: Request, res: Response, next: NextFunction) {
        try {
          const result = await this.userService.findStaff();
          if (result.isFailure) {
            return res.status(400).json({ message: result.error });
          }
          return res.status(200).json(result.getValue());
        }
        catch (error) {
          next(error);
        }
      }

       public async confirmAccount(req: Request, res: Response, next: NextFunction) {
          try {
            const result = await this.userService.confirmAccount(req.query.token as string);

            if (result.isFailure) {
              return res.send(`
                <html>
                  <body>
                    <h1>Conta Confirmada com Sucesso!</h1>
                    <p>Sua conta foi ativada. <a href="https://www.alpb.pt">Clique aqui para voltar ao site</a>.</p>
                  </body>
                </html>
              `);
            }  
             
            return res.redirect('https://www.alpb.pt/Login');  

          } catch (error) {
            next(error);
          }
        }
      
        public async getMe(req, res: Response) {
            try {
            const userRepo = Container.get(config.repos.user.name) as IUserRepo;
           

            if (!req.token || req.token === undefined) {
                return res.status(401).json({ message: "Token inexistente ou inválido" });
            }

            const user = await userRepo.findByID(req.token.id);
            if (!user) {
                return res.status(401).json({ message: "Utilizador não registado" });
            }

            const userDTO = UserMap.toDTO(user) as IUserDTO;
            return res.status(200).json(userDTO);
            } catch (error) {
            error.message = "Erro ao obter utilizador";
            }
        }
    
      public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
          const result = await this.userService.SignUp(req.body as IUserDTO);
          
          if (result.isFailure) {
            return res.status(400).json({ message: result.error });
          }
    
          return res.status(201).json(result.getValue());
        } catch (error) {
          next(error);
        }
      }
      
    
      public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
          const { email, password } = req.body;
          const result = await this.userService.SignIn(email, password);
    
          if (result.isFailure) {
            return res.status(401).json({ message: result.error });
          }
    
          return res.status(200).json(result.getValue());
        } catch (error) {
          next(error);
        }
      }
    
      public async signOut(req: Request, res: Response, next: NextFunction) {
        try {
          const token = req.headers.authorization?.split(' ')[1];
    
          if (!token) {
            return res.status(400).json({ message: "No token provided" });
          }
    
          const result = await this.userService.SignOut(token);
    
          if (result.isFailure) {
            return res.status(400).json({ message: result.error });
          }
    
          return res.status(200).json({ message: "Successfully logged out" });
        } catch (error) {
          next(error);
        }
      }
    
       public async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
          const { email } = req.body;
          const result = await this.userService.ForgotPassword(email);
    
          if (result.isFailure) {
            return res.status(400).json({ message: result.error });
          }
    
          return res.status(200).json({ message: result.getValue() });
        } catch (error) {
          next(error);
        }
      }
    
      public async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
          const { token, newPassword } = req.body;
          const result = await this.userService.ResetPassword(token, newPassword);
    
          if (result.isFailure) {
            return res.status(400).json({ message: result.error });
          }
    
          return res.status(200).json({ message: result.getValue() });
        } catch (error) {
          next(error);
        }
      } 
    }
    