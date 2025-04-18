import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface ProfileLoadProps {
    amount: string;
}

export class ProfileLoad extends AggregateRoot<ProfileLoadProps> {
    get id (): UniqueEntityID {
        return this._id;
    }

    get amount (): string {
        return this.props.amount;
    }

    set amount (value: string) {
        this.props.amount = value;
    }

    private constructor (props: ProfileLoadProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create (props: ProfileLoadProps, id?: UniqueEntityID): ProfileLoad {
        return new ProfileLoad(props, id);
    }
}