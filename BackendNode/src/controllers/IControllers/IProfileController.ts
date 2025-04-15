import { Request, Response, NextFunction } from 'express';

export default interface IProfileController {
    createProfile(req: Request, res: Response, next: NextFunction);
    updateProfile(req: Request, res: Response, next: NextFunction);
    getProfile(req: Request, res: Response, next: NextFunction);
    findByUserId(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
}