import { Battery } from "../../domain/Prosumer/Battery.ts/Battery";

export default interface IProsumerBatteryRepo {
  save(battery: Battery ): Promise<Battery>;
  findById(id: string): Promise<Battery>;
  findAll(): Promise<Battery[]>;
}

