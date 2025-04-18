import { Request, Response, NextFunction } from 'express';

export default interface IProsumerBatteryController {
    createBattery(req: Request, res: Response, next: NextFunction);
    updateBattery(req: Request, res: Response, next: NextFunction);
    getBattery(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
}