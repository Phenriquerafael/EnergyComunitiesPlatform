import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface StateOfChargeProps {
    amount: string;
}

export class StateOfCharge extends AggregateRoot<StateOfChargeProps> {
    get amount (): string {
        return this.props.amount;
    }

    set amount (value: string) {
        this.props.amount = value;
    }

    private constructor (props: StateOfChargeProps) {
        super(props);
    }

    public static create (props: StateOfChargeProps): StateOfCharge {
        return new StateOfCharge(props);
    }

/*     public toString (): string {
        return `StateOfCharge: { amount: ${this.props.amount} }`;
    } */
}