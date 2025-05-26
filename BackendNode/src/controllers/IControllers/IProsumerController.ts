import { Request, Response, NextFunction } from 'express';

export default interface IProsumerController {
    createProsumer(req: Request, res: Response, next: NextFunction);
    updateProsumer(req: Request, res: Response, next: NextFunction);
    getProsumer(req: Request, res: Response, next: NextFunction);
    findByUserId(req: Request, res: Response, next: NextFunction);
    findByBatteryId(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
    findByCommunityId(req: Request, res: Response, next: NextFunction);
    findAll2(req: Request, res: Response, next: NextFunction);
    deleteProsumer(req: Request, res: Response, next: NextFunction);
}