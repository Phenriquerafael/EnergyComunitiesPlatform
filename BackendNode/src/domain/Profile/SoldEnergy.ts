import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface SoldEnergyProps {
    amount: number;
    price?: number;
}

export class SoldEnergy extends AggregateRoot<SoldEnergyProps> {


    get amount (): number {
        return this.props.amount;
    }

    get price (): number | undefined {
        return this.props.price;
    }

    set amount (value: number) {
        this.props.amount = value;
    }

    set price (value: number | undefined) {
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