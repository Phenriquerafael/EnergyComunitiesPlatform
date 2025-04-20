import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface PhotovoltaicEnergyLoadProps {
amount: string;
}

export class PhotovoltaicEnergyLoad extends AggregateRoot<PhotovoltaicEnergyLoadProps>{
    
    get amount (): string {
        return this.props.amount;
    }

    set amount (value: string) {
        this.props.amount = value;
    }
    
    private constructor (props: PhotovoltaicEnergyLoadProps) {
        super(props);
    }
    
    public static create (props: PhotovoltaicEnergyLoadProps): PhotovoltaicEnergyLoad {
        return new PhotovoltaicEnergyLoad(props);
    }
/* 
    public toString (): string {
        return `PhotovoltaicEnergyLoad: { amount: ${this.props.amount} }`;
        
    } */
}