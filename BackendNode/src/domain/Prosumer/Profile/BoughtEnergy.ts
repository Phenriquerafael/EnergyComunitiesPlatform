import { Entity } from "../../../core/domain/Entity";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface BoughtEnergyProps {
    amount: string;
    price?: string;
}

export class BoughtEnergy extends Entity<BoughtEnergyProps> {
  private _price: string;
  private _amount?: string;

  get amount(): string {
    return this._amount;
  }

  get price(): string {
    return this._price;
  }

  set amount(value: string) {
    this.props.amount = value;
  }

  set price(value: string) {
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