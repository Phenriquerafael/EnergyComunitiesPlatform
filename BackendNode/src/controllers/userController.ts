import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';
import IUserService from '../services/IServices/IUserService';
import IUserController from './IControllers/IUserController';
import { IUserDTO } from '../dto/IUserDTO';
import { Result } from '../core/logic/Result';
import { Container } from '../container';
import { UserMap } from '../mappers/UserMap';
import IUserRepo from '../repos/IRepos/IUserRepo';

@Service()
export default class UserController implements IUserController {

  private get userServiceInstance(): IUserService {
    return Container.get(config.services.user.name) as IUserService;
  }

  public async toogleActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userServiceInstance.toogleActiveStatus(id);
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }
      return res.status(200).json({ data: "User activity toggled" });
    } catch (error) {
      return next(error);
      
    }
  }

  public async isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userServiceInstance.isAdmin(req.params.id);
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }
      return res.status(200).json({ data: result.getValue() });
    } catch (error) {
      return next(error);
    }
  }

  public async findStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userServiceInstance.findStaff();
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }
      return res.status(200).json({ data: result.getValue() });
    } catch (error) {
      return next(error);
    }
  }

  public async confirmAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userServiceInstance.confirmAccount(req.query.token as string);

      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }

      return res.send(`
        <html>
          <body>
            <h1>Conta Confirmada com Sucesso!</h1>
            <p>Sua conta foi ativada. <a href="https://www.alpb.pt">Clique aqui para voltar ao site</a>.</p>
          </body>
        </html>
      `);
    } catch (error) {
      return next(error);
    }
  }

  /*   public async getMe(req, res: Response, next: NextFunction) {
      try {
        if (!req.token || req.token === undefined) {
          return res.status(401).json({ message: 'Token inexistente ou inválido' });
        }

        const result = await this.userService.getMe(req.token.id);
        if (result.isFailure) {
          return res.status(401).json({ message: result.error });
        }

        return res.status(200).json({ data: result.getValue() });
      } catch (error) {
        return next(error); // Pass error to Express error handler
      }
    } */

public async getMe(req, res: Response) {
  try {
    console.log("req.token:", req.token); // Log para depurar
    const userRepo = Container.get(config.repos.user.name) as IUserRepo;

    if (!req.token || !req.token.id) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await userRepo.findById(req.token.id);
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const userDTO = UserMap.toDTO(user) as IUserDTO;
    return res.status(200).json(userDTO);
  } catch (error) {
    console.error("Error obtaining user:", error);
    return res.status(500).json({ message: "Error obtaining user" });
  }
}


  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userServiceInstance.SignUp(req.body as IUserDTO);
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }
      return res.status(201).json({ data: result.getValue() });
    } catch (error) {
      return next(error);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.userServiceInstance.SignIn(email, password);
      if (result.isFailure) {
        return res.status(401).json({ message: result.error });
      }
      return res.status(200).json({ data: result.getValue() });
    } catch (error) {
      return next(error);
    }
  }

  public async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(400).json({ message: 'No token provided' });
      }

      const result = await this.userServiceInstance.SignOut(token);
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }

      return res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
      return next(error);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.userServiceInstance.ForgotPassword(email);
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }
      return res.status(200).json({ message: result.getValue() });
    } catch (error) {
      return next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      const result = await this.userServiceInstance.ResetPassword(token, newPassword);
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }
      return res.status(200).json({ message: result.getValue() });
    } catch (error) {
      return next(error);
    }
  }

  public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userServiceInstance.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { firstName, lastName, phoneNumber, email, role, password } = req.body;

      // Gather the data to update from the request body
      const userDTO: IUserDTO = {
        firstName: firstName ?? undefined,  // Optional fields
        lastName: lastName ?? undefined,
        phoneNumber: phoneNumber ?? undefined,
        email: email ?? undefined,
        role: role ?? undefined,
        password: password ?? undefined
      };

      // Call the userService's update method to handle the actual update logic
      const result = await this.userServiceInstance.updateUser(id, userDTO);

      // If the update failed, return an error response
      if (result.isFailure) {
        return res.status(400).json({ message: result.error });
      }

      // Successfully updated user
      return res.status(200).json({ message: 'User updated successfully', data: result.getValue() });
    } catch (error) {
      return next(error);
    }
  }
}