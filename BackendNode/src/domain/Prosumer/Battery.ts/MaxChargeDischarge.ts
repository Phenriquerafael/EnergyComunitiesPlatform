import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface MaxChargeDischargeProps {
    value: string;
}
export class MaxChargeDischarge extends AggregateRoot<MaxChargeDischargeProps> {
    get value(): string {
        return this.props.value;
    }

    set value(value: string) {
        this.props.value = value;
    }

    constructor(props: MaxChargeDischargeProps) {
        super(props);
    }
    
    static create(props: MaxChargeDischargeProps): MaxChargeDischarge {
        return new MaxChargeDischarge(props);
    }

}