import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface PhotovoltaicEnergyLoadProps {
amount: string;
}

export class PhotovoltaicEnergyLoad extends AggregateRoot<PhotovoltaicEnergyLoadProps>{
    get id (): UniqueEntityID {
        return this._id;
    }
    
    get amount (): string {
        return this.props.amount;
    }

    set amount (value: string) {
        this.props.amount = value;
    }
    
    private constructor (props: PhotovoltaicEnergyLoadProps, id?: UniqueEntityID) {
        super(props, id);
    }
    
    public static create (props: PhotovoltaicEnergyLoadProps, id?: UniqueEntityID): PhotovoltaicEnergyLoad {
        return new PhotovoltaicEnergyLoad(props, id);
    }
}