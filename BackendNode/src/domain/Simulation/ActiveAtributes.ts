import { AggregateRoot } from "../../core/domain/AggregateRoot";

interface ActiveAttributesProps {
    prosumerId: string;
    profileLoad: boolean;
    stateOfCharge: boolean;
    photovoltaicEnergyLoad: boolean;
}

export class ActiveAttributes extends AggregateRoot<ActiveAttributesProps>{
    
    get prosumerId(): string {
        return this.props.prosumerId;
    }

    get profileLoad(): boolean {
        return this.props.profileLoad;
    }

    get stateOfCharge(): boolean {
        return this.props.stateOfCharge;
    }

    get photovoltaicEnergyLoad(): boolean {
        return this.props.photovoltaicEnergyLoad;
    }

    constructor(props: ActiveAttributesProps) {
        super(props);
    }

    public static create(props: ActiveAttributesProps): ActiveAttributes {
        return new ActiveAttributes(props);
    }
}