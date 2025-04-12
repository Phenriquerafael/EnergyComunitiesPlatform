import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { User } from "../User/user";
import { Profile } from "./Profile/Profile";
import { ProsumerBattery } from "./ProsumerBattery.ts/ProsumerBattery";

interface ProsumerProps {
    profile: Profile;
    battery: ProsumerBattery;
    user: User;
}

export class Prosumer extends AggregateRoot<ProsumerProps> {
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

    constructor(props: ProsumerProps) {
        super(props);
    }       

    static create(props: ProsumerProps): Prosumer {
        return new Prosumer(props);
    }
}
