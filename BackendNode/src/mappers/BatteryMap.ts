import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';


import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Battery } from "../domain/Prosumer/Battery.ts/Battery";
import IBatteryDTO from "../dto/IBatteryDTO";
import IBatteryPersistence from "../dataschema/IBatteryPersistence";



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

  public static toDomain (battery: any | Model<IBatteryPersistence & Document> ): Battery {
    const batteryOrError = Battery.create(
      battery,
      new UniqueEntityID(battery.id)
    );

    batteryOrError.isFailure ? console.log(batteryOrError.error) : '';

    return batteryOrError.isSuccess ? batteryOrError.getValue() : null;
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