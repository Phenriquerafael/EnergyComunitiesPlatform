import { Request, Response, NextFunction } from 'express';

export default interface IUserController  {
    signUp(req: Request, res: Response, next: NextFunction);
    signIn(req: Request, res: Response, next: NextFunction);
    signOut(req: Request, res: Response, next: NextFunction);
    forgotPassword(req: Request, res: Response, next: NextFunction);
    resetPassword(req: Request, res: Response, next: NextFunction);
    getMe(req: Request, res: Response, next: NextFunction);
    confirmAccount(req: Request, res: Response, next: NextFunction);
    findStaff(req: Request, res: Response, next: NextFunction);
    isAdmin(req: Request, res: Response, next: NextFunction);
    getAllUsers(req: Request, res: Response, next: NextFunction);
    updateUser(req: Request, res: Response, next: NextFunction);
}