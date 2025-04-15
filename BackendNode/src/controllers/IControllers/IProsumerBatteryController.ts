import { Request, Response, NextFunction } from 'express';

export default interface IProsumerBatteryController {
    createProsumerBattery(req: Request, res: Response, next: NextFunction);
    updateProsumerBattery(req: Request, res: Response, next: NextFunction);
    getProsumerBattery(req: Request, res: Response, next: NextFunction);
    findAll(req: Request, res: Response, next: NextFunction);
}