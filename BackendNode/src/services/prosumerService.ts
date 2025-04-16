import { Inject, Service } from "typedi";
import config from "../../config";
import IProsumerRepo from "../repos/IRepos/IProsumerRepo";
import IProsumerService from "./IServices/IProsumerService";
import { Result } from "../core/logic/Result";
import IProsumerDTO from "../dto/IProsumerDTO";
import { ProsumerMap } from "../mappers/ProsumerMap";
import { Battery } from "../domain/Prosumer/Battery.ts/Battery";
import IBatteryRepo from "../repos/IRepos/IBatteryRepo";
import IUserRepo from "../repos/IRepos/IUserRepo";

@Service()
export default class ProsumerService implements IProsumerService {
  constructor(
    @Inject(config.repos.prosumer.name) private prosumerRepo: IProsumerRepo,
    @Inject(config.repos.battery.name) private batteryRepo: IBatteryRepo,
    @Inject(config.repos.user.name) private userRepo: IUserRepo,

  ) {
    /* console.log('ProsumerService instantiated'); // Debug */
    }

    public async createProsumer(prosumerDTO: IProsumerDTO): Promise<Result<IProsumerDTO>> {
        try {
            let prosumerOrError = await this.prosumerRepo.findByUserId(prosumerDTO.userId);
            if (prosumerOrError.isSuccess) {
                return Result.fail<IProsumerDTO>("Prosumer already exists");
            }

            const batteryOrError = await this.batteryRepo.findById(prosumerDTO.batteryId);
            if (batteryOrError.isSuccess) {
                return Result.fail<IProsumerDTO>("Battery doens't exist");
            }

            const userOrError = await this.userRepo.findById(prosumerDTO.userId);
/*             if (userOrError.isFailure) {
                return Result.fail<IProsumerDTO>("User doesn't exist");
            } */

            prosumerOrError = ProsumerMap.toDomain(batteryOrError.getValue(), userOrError);

            if (prosumerOrError.isFailure) {
                return Result.fail<IProsumerDTO>("Error creating prosumer");
            }

            const prosumer = prosumerOrError.getValue();
            const savedProsumer = await this.prosumerRepo.save(prosumer);
            if (savedProsumer.isFailure) {
                return Result.fail<IProsumerDTO>("Error saving prosumer");
            }
            return Result.ok<IProsumerDTO>(ProsumerMap.toDTO(savedProsumer.getValue()));
        } catch (error) {
            console.log("Error creating prosumer: ", error);
            return Result.fail<IProsumerDTO>("Error creating prosumer");
            
        }
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