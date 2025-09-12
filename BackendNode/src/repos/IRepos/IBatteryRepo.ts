import { Result } from "../../core/logic/Result";
import { Battery } from "../../domain/Battery.ts/Battery";


export default interface IBatteryRepo {
  save(battery: Battery): Promise<Result<Battery>>;
  findById(id: string): Promise<Result<Battery>>;
  findAll(): Promise<Result<Battery[]>>;
  delete(id: string): Promise<Result<void>>;
}
