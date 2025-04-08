import { Result } from "../../core/logic/Result";
import { IUserDTO } from "../../dto/IUserDTO";

export default interface IUserService  {
  SignUp(userDTO: IUserDTO): Promise<Result<{userDTO: IUserDTO, token: string}>>;
  SignIn(email: string, password: string): Promise<Result<{ userDTO: IUserDTO, token: string }>>;
  SignOut(token: string): Promise<Result<void>>;
  ForgotPassword(email: string): Promise<Result<string>>;
  ResetPassword(token: string, password: string): Promise<Result<string>>; 
  confirmAccount(token:any): Promise<Result<void>>;
  getUser(id:string): Promise<Result<IUserDTO>>;
  findStaff(): Promise<Result<IUserDTO[]>>;
  isAdmin(id: string): Promise<Result<boolean>>;


}
