import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface SoldEnergyProps {
    amount: string;
    price: string;
}

export class SoldEnergy extends AggregateRoot<SoldEnergyProps> {
    get id (): UniqueEntityID {
        return this._id;
    }

    get amount (): string {
        return this.props.amount;
    }

    get price (): string {
        return this.props.price;
    }

    set amount (value: string) {
        this.props.amount = value;
    }

    set price (value: string) {
        this.props.price = value;
    }

    private constructor (props: SoldEnergyProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create (props: SoldEnergyProps, id?: UniqueEntityID): SoldEnergy {
        return new SoldEnergy(props, id);
    }
}