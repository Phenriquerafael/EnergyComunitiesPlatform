import { Service } from "typedi";
import IProsumerRepo from "./IRepos/IProsumerRepo";
import { Result } from "../core/logic/Result";
import { Prosumer } from "../domain/Prosumer/Prosumer";

@Service()
export default class ProsumerRepo implements IProsumerRepo {
    save(prosumer: Prosumer): Promise<Result<Prosumer>> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Result<Prosumer>> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Result<Prosumer[]>> {
        throw new Error("Method not implemented.");
    }
    findByUserId(userId: string): Promise<Result<Prosumer>> {
        throw new Error("Method not implemented.");
    }
    findByBatteryId(batteryId: string): Promise<Result<Prosumer>> {
        throw new Error("Method not implemented.");
    }
    
}