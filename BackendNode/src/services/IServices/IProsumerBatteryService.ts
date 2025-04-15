import { Result } from "../../core/logic/Result";
import IBatteryDTO from "../../dto/IBatteryDTO";

export default interface IProsumerBatteryService {
    createProsumerBattery(prosumerBatteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>>;
    updateProsumerBattery(prosumerBatteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>>;
    getProsumerBattery(prosumerBatteryId: string): Promise<Result<IBatteryDTO>>;
    findAll(): Promise<Result<IBatteryDTO[]>>;
}