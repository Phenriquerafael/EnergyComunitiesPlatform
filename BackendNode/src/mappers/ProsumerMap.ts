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
import {  User as PrismaUser } from "@prisma/client";
import { Community as PrismaCommunity } from "@prisma/client";
import { Battery as PrismaBattery } from "@prisma/client";
import IProsumerPersistence from "../dataschema/IProsumerPersistence";
import { Community } from "../domain/Community/Community";
import { CommunityMap } from "./CommunityMap";

export class ProsumerMap {
  public static toDTO(profile: Prosumer): IProsumerDTO {
    return {
        id: profile.id.toString(),
        batteryId: profile.battery.id.toString(),
        userId: profile.user.id.toString(),
        communityId: profile.community.id.toString() ,
    };
  }

    public static toDomainFromDto(id: string,battery: Battery, user: User, community:Community): Result<Prosumer> {
        const prosumerProps = {
            battery: battery,
            user: user,
            community: community,

        };

        return Prosumer.create(prosumerProps,new UniqueEntityID(id));
    }

    public static async toDomain(raw: IProsumerPersistence & {user: PrismaUser}& {battery: PrismaBattery}& {community: PrismaCommunity}): Promise<Result<Prosumer>> {
      try {
        const batteryInstance = (await BatteryMap.toDomain(raw.battery)).getValue();
        const userInstance = (await UserMap.toDomain(raw.user)).getValue();
        const communityInstance = (await CommunityMap.toDomain(raw.community)).getValue();
     

        // Criar a entidade Prosumer
        const prosumerProps = {
          battery: batteryInstance,
          user: userInstance,
          community: communityInstance,

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
        communityId:  prosumer.community.id.toString() ,
        };
    }
}