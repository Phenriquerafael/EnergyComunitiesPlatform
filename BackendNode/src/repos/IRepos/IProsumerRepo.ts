import { Result } from '../../core/logic/Result';
import { Prosumer } from '../../domain/Prosumer/Prosumer';


export default interface IProsumerRepo {
  save(prosumer: Prosumer): Promise<Result<Prosumer>>;
  findById(id: string): Promise<Result<Prosumer>>;
  findAll(): Promise<Result<Prosumer[]>>;
  findByUserId(userId: string): Promise<Result<Prosumer>>;
  findByBatteryId(batteryId: string): Promise<Result<Prosumer>>;
}