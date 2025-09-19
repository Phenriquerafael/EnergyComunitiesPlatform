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
    findByProsumerIdAndSimulationId(req: Request, res: Response, next: NextFunction);
    findBySimulationId(req: Request, res: Response, next: NextFunction);
    findByCommunityIdAndSimulationId(req: Request, res: Response, next: NextFunction);
    //Community profiles
    getProfileHourlyStats(req: Request, res: Response, next: NextFunction);
    getProfileDailyStats(req: Request, res: Response, next: NextFunction);
    getProfileWeeklyStats(req: Request, res: Response, next: NextFunction);
    getProfileMonthlyStats(req: Request, res: Response, next: NextFunction);
    //Prosumer profiles
    getProsumerHourlyStats(req: Request, res: Response, next: NextFunction);
    getProsumerDailyStats(req: Request, res: Response, next: NextFunction);
    getProsumerWeeklyStats(req: Request, res: Response, next: NextFunction);
    getProsumerMonthlyStats(req: Request, res: Response, next: NextFunction);
    //Statistics
    countProfilesBySimulationId(req: Request, res: Response, next: NextFunction);
    getSimulationStats(req: Request, res: Response, next: NextFunction);
}