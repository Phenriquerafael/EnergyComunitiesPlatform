
import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { Prosumer } from "../Prosumer";
import { BoughtEnergy } from "./BoughtEnergy";
import { PhotovoltaicEnergyLoad } from "./PhotovoltaicEnergyLoad";
import { ProfileLoad } from "./ProfileLoad";
import { SoldEnergy } from "./SoldEnergy";
import { StateOfCharge } from "./StateOfCharge";
import { TimeStamp } from "./TimeStamp";

interface ProfileProps {
    prosumer: Prosumer;
    timestamp:TimeStamp;
    profileLoad: ProfileLoad;
    stateOfCharge: StateOfCharge;
    photovoltaicEnergyLoad: PhotovoltaicEnergyLoad;
    boughtEnergy: BoughtEnergy;
    soldEnergy: SoldEnergy;
}

export class Profile extends AggregateRoot<ProfileProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get prosumer(): Prosumer {
        return this.props.prosumer;
    }
    get timestamp(): TimeStamp {
        return this.props.timestamp;
    }

    get profileLoad(): ProfileLoad {
        return this.props.profileLoad;
    }

    get stateOfCharge(): StateOfCharge {
        return this.props.stateOfCharge;
    }

    get photovoltaicEnergyLoad(): PhotovoltaicEnergyLoad {
        return this.props.photovoltaicEnergyLoad;
    }
    get boughtEnergy(): BoughtEnergy {
        return this.props.boughtEnergy;
    }   
    get soldEnergy(): SoldEnergy {
        return this.props.soldEnergy;
    }

    set timestamp(value: TimeStamp) {
        this.props.timestamp = value;
    }
    set profileLoad(value: ProfileLoad) {
        this.props.profileLoad = value;
    }
    set stateOfCharge(value: StateOfCharge) {
        this.props.stateOfCharge = value;
    }
    set photovoltaicEnergyLoad(value: PhotovoltaicEnergyLoad) {
        this.props.photovoltaicEnergyLoad = value;
    }
    set boughtEnergy(value: BoughtEnergy) {
        this.props.boughtEnergy = value;
    }
    set soldEnergy(value: SoldEnergy) {
        this.props.soldEnergy = value;
    }

    set prosumer(value: Prosumer) {
        this.props.prosumer = value;
    }


    private constructor(props: ProfileProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ProfileProps, id?: UniqueEntityID): Result<Profile> {
        const guardedProps = [
            { argument: props.prosumer, argumentName: 'prosumer' },
            { argument: props.timestamp, argumentName: 'timestamp' },
            { argument: props.profileLoad, argumentName: 'profileLoad' },
            { argument: props.stateOfCharge, argumentName: 'stateOfCharge' },
            { argument: props.photovoltaicEnergyLoad, argumentName: 'photovoltaicEnergyLoad' },
            { argument: props.boughtEnergy, argumentName: 'boughtEnergy' },
            { argument: props.soldEnergy, argumentName: 'soldEnergy' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Profile>(guardResult.message);
        }else {
            const profile = new Profile(props, id);
            return Result.ok<Profile>(profile);
        }
        
        
    }
}