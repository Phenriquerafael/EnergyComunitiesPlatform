import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface MaxChargeDischargeProps {
    maxCharge: string;
    maxDischarge: string;
}
export class MaxChargeDischarge extends AggregateRoot<MaxChargeDischargeProps> {
    get maxCharge(): string {
        return this.props.maxCharge;
    }

    get maxDischarge(): string {
        return this.props.maxDischarge;
    }

    set maxCharge(value: string) {
        this.props.maxCharge = value;
    }

    set maxDischarge(value: string) {
        this.props.maxDischarge = value;
    }

    constructor(props: MaxChargeDischargeProps) {
        super(props);
    }
    
    static create(props: MaxChargeDischargeProps): MaxChargeDischarge {
        return new MaxChargeDischarge(props);
    }

}