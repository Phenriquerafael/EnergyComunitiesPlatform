import { Result } from "../../core/logic/Result";
import IBatteryDTO from "../../dto/IBatteryDTO";

export default interface IProsumerBatteryService {
    createBattery(prosumerBatteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>>;
    updateBattery(prosumerBatteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>>;
    getBattery(prosumerBatteryId: string): Promise<Result<IBatteryDTO>>;
    findAll(): Promise<Result<IBatteryDTO[]>>;
}