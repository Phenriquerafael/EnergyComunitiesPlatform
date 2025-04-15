import { Inject, Service } from "typedi";
import config from "../../config";
import IProsumerRepo from "../repos/IRepos/IProsumerRepo";
import IProsumerService from "./IServices/IProsumerService";
import { Result } from "../core/logic/Result";
import IProsumerDTO from "../dto/IProsumerDTO";

@Service()
export default class ProsumerService implements IProsumerService {
  constructor(
    @Inject(config.repos.prosumer.name) private prosumerRepo: IProsumerRepo
  ) {
    /* console.log('ProsumerService instantiated'); // Debug */
    }

    public async createProsumer(prosumerDTO: IProsumerDTO): Promise<Result<IProsumerDTO>> {
        throw new Error("Method not implemented.");
    }

    public async updateProsumer(prosumerDTO: IProsumerDTO): Promise<Result<IProsumerDTO>> {
        throw new Error("Method not implemented.");
    }

    public async getProsumer(prosumerId: string): Promise<Result<IProsumerDTO>> {
        throw new Error("Method not implemented.");
    }

    public async findAll(): Promise<Result<IProsumerDTO[]>> {
        throw new Error("Method not implemented.");
    }

    public async findByUserId(userId: string): Promise<Result<IProsumerDTO>> {
        throw new Error("Method not implemented.");
    }

    public async findByBatteryId(batteryId: string): Promise<Result<IProsumerDTO>> {
        throw new Error("Method not implemented.");
    }

}