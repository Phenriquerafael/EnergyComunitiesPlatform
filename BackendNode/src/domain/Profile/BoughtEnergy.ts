import { Entity } from "../../core/domain/Entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface BoughtEnergyProps {
    amount: number;
    price?: number;
}

export class BoughtEnergy extends Entity<BoughtEnergyProps> {
  private _price: number;
  private _amount?: number;

  get amount(): number {
    return this._amount;
  }

  get price(): number {
    return this._price;
  }

  set amount(value: number) {
    this.props.amount = value;
  }

  set price(value: number) {
    this.props.price = value;
  }

    private constructor (props: BoughtEnergyProps) {
        super(props);
        this._amount = props.amount;
        this._price = props.price;
    }

    public static create (props: BoughtEnergyProps): BoughtEnergy {
      return new BoughtEnergy(props);
    }

/*     public toString (): string {
      return `BoughtEnergy: { amount: ${this.props.amount}, price: ${this.props.price} }`;
    }
 */

}   