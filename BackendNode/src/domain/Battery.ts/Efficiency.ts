import { AggregateRoot } from "../../core/domain/AggregateRoot";

interface EfficiencyProps {
    value: number;
}

export class Efficiency extends AggregateRoot<EfficiencyProps> {
    get value(): number {
        return this.props.value;
    }

    set value(value: number) {
        this.props.value = value;
    }

    constructor(props: EfficiencyProps) {
        super(props);
    }
    
    static create(props: EfficiencyProps): Efficiency {
        return new Efficiency(props);
    }
}