import { Request, Response, NextFunction } from 'express';

export default interface ICommunityController {
    createCommunity(req: Request, res: Response, next: NextFunction);
    updateCommunity(req: Request, res: Response, next: NextFunction);
    getCommunity(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
}