import { Result } from "../../core/logic/Result";
import IProsumerBatteryDTO from "../../dto/IProsumerBatteryDTO";

export default interface IProsumerBatteryService {
    createProsumerBattery(prosumerBatteryDTO: IProsumerBatteryDTO): Promise<Result<IProsumerBatteryDTO>>;
    updateProsumerBattery(prosumerBatteryDTO: IProsumerBatteryDTO): Promise<Result<IProsumerBatteryDTO>>;
    getProsumerBattery(prosumerBatteryId: string): Promise<Result<IProsumerBatteryDTO>>;
    findAll(): Promise<Result<IProsumerBatteryDTO[]>>;
}