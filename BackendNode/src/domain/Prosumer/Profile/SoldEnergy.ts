import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface SoldEnergyProps {
    amount: string;
    price?: string;
}

export class SoldEnergy extends AggregateRoot<SoldEnergyProps> {


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

    private constructor (props: SoldEnergyProps) {
        super(props);
    }

    public static create (props: SoldEnergyProps): SoldEnergy {
        return new SoldEnergy(props);
    }

/*     public toString (): string {
        return `SoldEnergy: { amount: ${this.props.amount}, price: ${this.props.price} }`;
    } */
}