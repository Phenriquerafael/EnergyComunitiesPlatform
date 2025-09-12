import { AggregateRoot } from "../../core/domain/AggregateRoot";


interface ProfileLoadProps {
    amount: number;
}

export class Load extends AggregateRoot<ProfileLoadProps> {

    get amount (): number {
        return this.props.amount;
    }

    set amount (value: number) {
        this.props.amount = value;
    }

    private constructor (props: ProfileLoadProps) {
        super(props);
    }

    public static create (props: ProfileLoadProps): Load {
        return new Load(props);
    }

/*     public toString (): string {
        return `ProfileLoad: { amount: ${this.props.amount} }`;
    } */
}