import { Request, Response, NextFunction } from 'express';

export default interface ISimulationController {
  createSimulation(req: Request, res: Response, next: NextFunction);
  updateSimulation(req: Request, res: Response, next: NextFunction);
  getSimulation(req: Request, res: Response, next: NextFunction);
  findAll(req: Request, res: Response, next: NextFunction);
  delete(req: Request, res: Response, next: NextFunction);
  deleteAll(req: Request, res: Response, next: NextFunction);
}