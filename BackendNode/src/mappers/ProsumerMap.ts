import { Prosumer } from "../domain/Prosumer/Prosumer";
import IProsumerDTO from "../dto/IProsumerDTO";
import IBatteryDTO from "../dto/IBatteryDTO";
import { IUserDTO } from "../dto/IUserDTO";
import { Battery } from "../domain/Prosumer/Battery.ts/Battery";
import { User } from "../domain/User/user";
import { BatteryMap } from "./BatteryMap";
import { UserMap } from "./UserMap";
import { Result } from "../core/logic/Result";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import prisma from "../../prisma/prismaClient";
import IProsumerPersistence from "../dataschema/IProsumerPersistence";

export class ProsumerMap {
  public static toDTO(profile: Prosumer): IProsumerDTO {
    return {
        id: profile.id.toString(),
        batteryId: profile.battery.id.toString(),
        userId: profile.user.id.toString(),
    };
  }

    public static toDomainFromDto(id: string,battery: Battery, user: User): Result<Prosumer> {
        const prosumerProps = {
            battery: battery,
            user: user,
        };

        return Prosumer.create(prosumerProps,new UniqueEntityID(id));
    }

    public static async toDomain(raw: IProsumerPersistence): Promise<Result<Prosumer>> {
      try {
        // Obter a Battery
        let battery: Battery;
        if (raw.battery) {
          // Se battery já está incluído, mapeá-lo diretamente
          const batteryOrError = BatteryMap.toDomain(raw.battery);
          if (batteryOrError.isFailure) {
            return Result.fail<Prosumer>(batteryOrError.error);
          }
          battery = batteryOrError.getValue();
        } else {
          // Buscar Battery no banco usando batteryId
          const batteryData = await prisma.battery.findUnique({
            where: { id: raw.batteryId },
          });
          if (!batteryData) {
            return Result.fail<Prosumer>("Battery not found for Prosumer");
          }
          const batteryOrError = BatteryMap.toDomain(batteryData);
          if (batteryOrError.isFailure) {
            return Result.fail<Prosumer>(batteryOrError.error);
          }
          battery = batteryOrError.getValue();
        }
  
        // Obter o User
        let user: User;
        if (raw.user) {
          // Se user já está incluído, mapeá-lo diretamente
          const userOrError = await UserMap.toDomain(raw.user);
/*           if (userOrError.isFailure) {
            return Result.fail<Prosumer>(userOrError.error);
          } */
          user = userOrError/* .getValue() */;
        } else {
          // Buscar User no banco usando userId
          const userData = await prisma.user.findUnique({
            where: { id: raw.userId },
          });
          if (!userData) {
            return Result.fail<Prosumer>("User not found for Prosumer");
          }
          const userOrError = await UserMap.toDomain(userData);
/*           if (userOrError.isFailure) {
            return Result.fail<Prosumer>(userOrError.error);
          } */
          user = userOrError/* .getValue() */;
        }
  
        // Criar a entidade Prosumer
        const prosumerProps = {
          battery,
          user,
        };
  
        const prosumerOrError = Prosumer.create(prosumerProps, new UniqueEntityID(raw.id));
        if (prosumerOrError.isFailure) {
          return Result.fail<Prosumer>(prosumerOrError.error);
        }
  
        return Result.ok<Prosumer>(prosumerOrError.getValue());
      } catch (error) {
        console.error("Error mapping Prosumer:", error);
        return Result.fail<Prosumer>("Failed to map Prosumer from persistence");
      }
    }


    public static toPersistence(prosumer: Prosumer): any {
        return {
        id: prosumer.id.toString(),
        batteryId: prosumer.battery.id.toString(),
        userId: prosumer.user.id.toString(),
        };
    }
}