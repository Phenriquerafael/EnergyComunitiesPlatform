import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { User } from "../User/user";
import { Profile } from "./Profile/Profile";
import { ProsumerBattery } from "./ProsumerBattery.ts/ProsumerBattery";

interface ProsumerProps {
    profile: Profile;
    battery: ProsumerBattery;
    user: User;
}

export class Prosumer extends AggregateRoot<ProsumerProps> {

    get id (): UniqueEntityID {
        return this._id;
    }

    get profile(): Profile {
        return this.props.profile;
    }

    get battery(): ProsumerBattery {
        return this.props.battery;
    }

    get user(): User {
        return this.props.user;
    }

    set profile(value: Profile) {
        this.props.profile = value;
    }

    set battery(value: ProsumerBattery) {
        this.props.battery = value;
    }

    set user(value: User) {
        this.props.user = value;
    }

    constructor(props: ProsumerProps, id?: UniqueEntityID) {
        super(props, id);
    }       

    static create(props: ProsumerProps, id?: UniqueEntityID): Result<Prosumer> {
        const guardedProps = [
            { argument: props.battery, argumentName: 'battery' },
            { argument: props.user, argumentName: 'user' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result.fail(guardResult.message);
        }else {
            const prosumer = new Prosumer(props, id);
            return Result.ok(prosumer);
        }

    }
}
