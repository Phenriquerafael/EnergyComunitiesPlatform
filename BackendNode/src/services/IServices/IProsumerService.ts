
import { Result } from "../../core/logic/Result";
import IProsumerDTO from "../../dto/IProsumerDTO";


export default interface IProsumerService {
    createProsumer(prosumerDTO: IProsumerDTO): Promise<Result<IProsumerDTO>>;
    updateProsumer(prosumerDTO: IProsumerDTO): Promise<Result<IProsumerDTO>>;
    getProsumer(prosumerId: string): Promise<Result<IProsumerDTO>>;
    findAll(): Promise<Result<IProsumerDTO[]>>;
    findByUserId(userId: string): Promise<Result<IProsumerDTO>>;
    findByBatteryId(batteryId: string): Promise<Result<IProsumerDTO>>;
}