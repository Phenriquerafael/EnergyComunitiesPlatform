import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface MaxCapacityProps {
    value: string;
}

export class MaxCapacity extends AggregateRoot<MaxCapacityProps> {
    get value(): string {
        return this.props.value;
    }

    set value(value: string) {
        this.props.value = value;
    }

    constructor(props: MaxCapacityProps) {
        super(props);
    }
    
    static create(props: MaxCapacityProps): MaxCapacity {
        return new MaxCapacity(props);
    }
}