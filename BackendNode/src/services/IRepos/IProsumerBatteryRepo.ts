import { ProsumerBattery } from "../../domain/Prosumer/ProsumerBattery.ts/ProsumerBattery";

export default interface IProsumerBatteryRepo {
  save(battery: ProsumerBattery ): Promise<ProsumerBattery>;
  findById(id: string): Promise<ProsumerBattery>;
  findAll(): Promise<ProsumerBattery[]>;
}

