import { Request, Response, NextFunction } from 'express';

export default interface IProfileController {
    createProfile(req: Request, res: Response, next: NextFunction);
    updateProfile(req: Request, res: Response, next: NextFunction);
    getProfile(req: Request, res: Response, next: NextFunction);
    findByProsumerId(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
    createFromOptimizationResults(req: Request, res: Response, next: NextFunction);
    deleteProfile(req: Request, res: Response, next: NextFunction);
    findByCommunityId(req: Request, res: Response, next: NextFunction);
    deleteByCommunityId(req: Request, res: Response, next: NextFunction);
    deleteByProsumerId(req: Request, res: Response, next: NextFunction);
}