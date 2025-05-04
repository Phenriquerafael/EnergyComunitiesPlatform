import { Result } from "../../core/logic/Result";
import IBatteryDTO from "../../dto/IBatteryDTO";

export default interface IBatteryService {
    createBattery(batteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>>;
    updateBattery(batteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>>;
    getBattery(batteryId: string): Promise<Result<IBatteryDTO>>;
    findAll(): Promise<Result<IBatteryDTO[]>>;
    deleteBattery(batteryId: string): Promise<Result<void>>;
    createBatteries(batteryDTOs: IBatteryDTO[]): Promise<Result<IBatteryDTO[]>>;
}