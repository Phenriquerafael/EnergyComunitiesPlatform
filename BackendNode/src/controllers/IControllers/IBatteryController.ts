import { Request, Response, NextFunction } from 'express';

export default interface IBatteryController {
    createBattery(req: Request, res: Response, next: NextFunction);
    updateBattery(req: Request, res: Response, next: NextFunction);
    getBattery(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
    deleteBattery(req: Request, res: Response, next: NextFunction);
    createBatteries(req: Request, res: Response, next: NextFunction);
}