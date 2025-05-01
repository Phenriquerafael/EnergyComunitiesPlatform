import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface ProfileLoadProps {
    amount: string;
}

export class Load extends AggregateRoot<ProfileLoadProps> {

    get amount (): string {
        return this.props.amount;
    }

    set amount (value: string) {
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