import { Inject, Service } from "typedi";
import config from "../../config";
import IBatteryService from "./IServices/IProsumerBatteryService";
import IBatteryRepo from "../repos/IRepos/IProsumerBatteryRepo";
import { Result } from "../core/logic/Result";
import IBatteryDTO from "../dto/IBatteryDTO";
import { Battery } from "../domain/Prosumer/Battery.ts/Battery";
import { BatteryDescription as BatteryInformation } from "../domain/Prosumer/Battery.ts/BatteryInformation";
import { Efficiency } from "../domain/Prosumer/Battery.ts/Efficiency";
import { MaxCapacity } from "../domain/Prosumer/Battery.ts/MaxCapacity";
import { MaxChargeDischarge } from "../domain/Prosumer/Battery.ts/MaxChargeDischarge";
import { BatteryMap } from "../mappers/BatteryMap";

@Service()
export default class BatteryService implements IBatteryService {
  constructor(
    @Inject(config.repos.battery.name) private batteryRepoInstance: IBatteryRepo
  ) {
    /* console.log('ProsumerBatteryService instantiated'); // Debug */
    }

    public async createProsumerBattery(prosumerBatteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>> {

try{        const batteryInformation = BatteryInformation.create({
            name: prosumerBatteryDTO.name,
            description: prosumerBatteryDTO.description
        });

        const efficiency = Efficiency.create({
            value: prosumerBatteryDTO.efficiency,
        });

        const maxCapacity = MaxCapacity.create({
            value: prosumerBatteryDTO.maxCapacity,
        });

        const maxChargeDischarge = MaxChargeDischarge.create({
            maxCharge: prosumerBatteryDTO.maxChargeDischarge,
            maxDischarge: prosumerBatteryDTO.maxChargeDischarge,
        });


        const prosumerBatteryProps = {
            batteryInformation: batteryInformation,
            efficiency: efficiency,
            maxCapacity: maxCapacity,
            maxChargeDischarge: maxChargeDischarge,
        };
        const prosumerBattery = Battery.create(prosumerBatteryProps).getValue();
        return this.batteryRepoInstance.save(prosumerBattery).then((prosumerBattery) => {
            return Result.ok<IBatteryDTO>(BatteryMap.toDTO(prosumerBattery));
        });}
    catch (error) {
        console.log("Error creating prosumer battery: ", error);
        return Result.fail<IBatteryDTO>("Error creating prosumer battery");
    }
}
    

    public async updateProsumerBattery(prosumerBatteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>> {
        throw new Error("Method not implemented.");
    }

    public async getProsumerBattery(prosumerBatteryId: string): Promise<Result<IBatteryDTO>> {
        throw new Error("Method not implemented.");
    }

    public async findAll(): Promise<Result<IBatteryDTO[]>> {
        throw new Error("Method not implemented.");
    }

}