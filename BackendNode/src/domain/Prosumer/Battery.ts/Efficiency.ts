import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface EfficiencyProps {
    value: string;
}

export class Efficiency extends AggregateRoot<EfficiencyProps> {
    get value(): string {
        return this.props.value;
    }

    set value(value: string) {
        this.props.value = value;
    }

    constructor(props: EfficiencyProps) {
        super(props);
    }
    
    static create(props: EfficiencyProps): Efficiency {
        return new Efficiency(props);
    }
}