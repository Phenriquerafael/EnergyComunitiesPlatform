import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface StateOfChargeProps {
    amount: number;
}

export class StateOfCharge extends AggregateRoot<StateOfChargeProps> {
    get amount (): number {
        return this.props.amount;
    }

    set amount (value: number) {
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