import { BoughtEnergy } from "./BoughtEnergy";
import { PhotovoltaicEnergyLoad } from "./PhotovoltaicEnergyLoad";
import { ProfileLoad } from "./ProfileLoad";
import { SoldEnergy } from "./SoldEnergy";
import { StateOfCharge } from "./StateOfCharge";
import { TimeStamp } from "./TimeStamp";

interface ProfileProps {
    timestamp:TimeStamp;
    profileLoad: ProfileLoad;
    stateOfCharge: StateOfCharge;
    photovoltaicEnergyLoad: PhotovoltaicEnergyLoad;
    boughtEnergy: BoughtEnergy;
    soldEnergy: SoldEnergy;
}

export class Profile {
    private props: ProfileProps;

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


    private constructor(props: ProfileProps) {
        this.props = props;
    }

    public static create(props: ProfileProps): Profile {
        return new Profile(props);
    }
}