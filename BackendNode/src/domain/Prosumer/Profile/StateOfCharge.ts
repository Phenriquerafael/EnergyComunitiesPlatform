import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface StateOfChargeProps {
    amount: string;
}

export class StateOfCharge extends AggregateRoot<StateOfChargeProps> {
    get id (): UniqueEntityID {
        return this._id;
    }

    get amount (): string {
        return this.props.amount;
    }

    set amount (value: string) {
        this.props.amount = value;
    }

    private constructor (props: StateOfChargeProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create (props: StateOfChargeProps, id?: UniqueEntityID): StateOfCharge {
        return new StateOfCharge(props, id);
    }
}