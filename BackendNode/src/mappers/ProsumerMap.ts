import { Prosumer } from "../domain/Prosumer/Prosumer";
import IProsumerDTO from "../dto/IProsumerDTO";
import IBatteryDTO from "../dto/IBatteryDTO";
import { IUserDTO } from "../dto/IUserDTO";
import { Battery } from "../domain/Prosumer/Battery.ts/Battery";
import { User } from "../domain/User/user";
import { BatteryMap } from "./BatteryMap";
import { UserMap } from "./UserMap";
import { Result } from "../core/logic/Result";

export class ProsumerMap {
  public static toDTO(profile: Prosumer): IProsumerDTO {
    return {
        id: profile.id.toString(),
        batteryId: profile.battery.id.toString(),
        userId: profile.user.id.toString(),
    };
  }

/*   public static async toDomain( batteryDTO:IBatteryDTO, userDTO:IUserDTO): Promise<Result<Prosumer>> {
    const battery = BatteryMap.toDomain(batteryDTO);
    if (battery.isFailure) {
        console.log(battery.error);
        return null;
    }

    const user = await UserMap.toDomain(userDTO);


    const prosumerProps = {
      battery: battery.getValue(),
      user:  user,
    };

    return Prosumer.create(prosumerProps);
  } */

    public static toDomain(battery: Battery, user: User): Result<Prosumer> {
        const prosumerProps = {
            battery: battery,
            user: user,
        };

        return Prosumer.create(prosumerProps);
    }

    public static toPersistence(prosumer: Prosumer): any {
        return {
        id: prosumer.id.toString(),
        batteryId: prosumer.battery.id.toString(),
        userId: prosumer.user.id.toString(),
        };
    }
}