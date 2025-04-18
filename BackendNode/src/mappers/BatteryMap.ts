import { Mapper } from "../core/infra/Mapper";

import { Battery } from '../domain/Prosumer/Battery.ts/Battery';
import { BatteryDescription as BatteryInformation } from '../domain/Prosumer/Battery.ts/BatteryInformation';
import { Efficiency } from '../domain/Prosumer/Battery.ts/Efficiency';
import { MaxCapacity } from '../domain/Prosumer/Battery.ts/MaxCapacity';
import { MaxChargeDischarge } from '../domain/Prosumer/Battery.ts/MaxChargeDischarge';


import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import IBatteryDTO from "../dto/IBatteryDTO";
import IBatteryPersistence from "../dataschema/IBatteryPersistence";
import { Result } from "../core/logic/Result";



export class BatteryMap extends Mapper<Battery> {
  
  public static toDTO( battery: Battery): IBatteryDTO {
    return {
      id: battery.id.toString(),
        name: battery.batteryInformation.name,
        description: battery.batteryInformation.description,
        efficiency: battery.efficiency.value,
        maxCapacity: battery.maxCapacity.value,
        maxChargeDischarge: battery.maxChargeDischarge.maxCharge,
        maxDischarge: battery.maxChargeDischarge.maxDischarge,

    } as IBatteryDTO;
  }

  public static toDomainFromDTO (batteryDTO:IBatteryDTO ): Result<Battery> {
const batteryInformation = BatteryInformation.create({
        name: batteryDTO.name,
        description: batteryDTO.description,
      });

      const efficiency = Efficiency.create({
        value: batteryDTO.efficiency,
      });

      const maxCapacity = MaxCapacity.create({
        value: batteryDTO.maxCapacity,
      });

      const maxChargeDischarge = MaxChargeDischarge.create({
        maxCharge: batteryDTO.maxChargeDischarge,
        maxDischarge: batteryDTO.maxChargeDischarge,
      });

      const prosumerBatteryProps = {
        batteryInformation: batteryInformation,
        efficiency: efficiency,
        maxCapacity: maxCapacity,
        maxChargeDischarge: maxChargeDischarge,
      };
      return Battery.create(prosumerBatteryProps,
      new UniqueEntityID(batteryDTO.id)
      );
  }

  public static async toDomain (rawBattery: IBatteryPersistence): Promise<Result<Battery>> {
    const batteryInformation = BatteryInformation.create({
      name: rawBattery.name,
      description: rawBattery.description,
    });

    const efficiency = Efficiency.create({
      value: rawBattery.efficiency,
    });

    const maxCapacity = MaxCapacity.create({
      value: rawBattery.maxCapacity,
    });

    const maxChargeDischarge = MaxChargeDischarge.create({
      maxCharge: rawBattery.maxChargeDischarge,
      maxDischarge: rawBattery.maxChargeDischarge,
    });

    const prosumerBatteryProps = {
      batteryInformation: batteryInformation,
      efficiency: efficiency,
      maxCapacity: maxCapacity,
      maxChargeDischarge: maxChargeDischarge,
    };

    const batteryOrError = Battery.create(prosumerBatteryProps, new UniqueEntityID(rawBattery.id));
    if (batteryOrError.isFailure) {
      return Result.fail<Battery>(batteryOrError.error);
    }
    return Result.ok<Battery>(batteryOrError.getValue());
  }

  public static toPersistence (battery: Battery): any {
    return {
      id: battery.id.toString(),
      name: battery.batteryInformation.name,
        description: battery.batteryInformation.description,
        efficiency: battery.efficiency.value,
        maxCapacity: battery.maxCapacity.value,
        maxChargeDischarge: battery.maxChargeDischarge.maxCharge,
    }
  }
}