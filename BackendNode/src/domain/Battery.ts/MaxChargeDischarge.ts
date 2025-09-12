import { AggregateRoot } from "../../core/domain/AggregateRoot";

interface MaxChargeDischargeProps {
    value: number;
}
export class MaxChargeDischarge extends AggregateRoot<MaxChargeDischargeProps> {
    get value(): number {
        return this.props.value;
    }

    set value(value: number) {
        this.props.value = value;
    }

    constructor(props: MaxChargeDischargeProps) {
        super(props);
    }
    
    static create(props: MaxChargeDischargeProps): MaxChargeDischarge {
        return new MaxChargeDischarge(props);
    }

}