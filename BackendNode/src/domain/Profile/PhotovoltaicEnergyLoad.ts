import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface PhotovoltaicEnergyLoadProps {
amount: number;
}

export class PhotovoltaicEnergyLoad extends AggregateRoot<PhotovoltaicEnergyLoadProps>{
    
    get amount (): number {
        return this.props.amount;
    }

    set amount (value: number) {
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