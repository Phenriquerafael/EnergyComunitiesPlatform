import { AggregateRoot } from "../../core/domain/AggregateRoot";

interface BatteryInformationsProps {
    name: string;
    description: string;
}

export class BatteryDescription extends AggregateRoot<BatteryInformationsProps> {
    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
    }

    set name(value: string) {
        this.props.name = value;
    }

    set description(value: string) {
        this.props.description = value;
    }

    constructor(props: BatteryInformationsProps) {
        super(props);
    }
    
    static create(props: BatteryInformationsProps): BatteryDescription {
        return new BatteryDescription(props);
    }
}