import { AggregateRoot } from "../../core/domain/AggregateRoot";

interface MaxCapacityProps {
    value: number;
}

export class MaxCapacity extends AggregateRoot<MaxCapacityProps> {
    get value(): number {
        return this.props.value;
    }

    set value(value: number) {
        this.props.value = value;
    }

    constructor(props: MaxCapacityProps) {
        super(props);
    }
    
    static create(props: MaxCapacityProps): MaxCapacity {
        return new MaxCapacity(props);
    }
}