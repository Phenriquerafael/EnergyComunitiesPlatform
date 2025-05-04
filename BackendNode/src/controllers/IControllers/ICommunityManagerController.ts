import { Request, Response, NextFunction } from 'express';

export default interface ICommunityManagerController {
    createCommunityManager(req: Request, res: Response, next: NextFunction);
    updateCommunityManager(req: Request, res: Response, next: NextFunction);
    getCommunityManager(req: Request, res: Response, next: NextFunction);
    findByUserId(req: Request, res: Response, next: NextFunction);
    findByCommunityId(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
}