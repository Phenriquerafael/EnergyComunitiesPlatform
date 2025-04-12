import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface BatteryDescriptionProps {
    name: string;
    description: string;
}

export class BatteryDescription extends AggregateRoot<BatteryDescriptionProps> {
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

    constructor(props: BatteryDescriptionProps) {
        super(props);
    }
    
    static create(props: BatteryDescriptionProps): BatteryDescription {
        return new BatteryDescription(props);
    }
}