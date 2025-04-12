import { Entity } from "../../../core/domain/Entity";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

interface BoughtEnergyProps {
    amount: string;
    price: string;
}

export class BoughtEnergy extends Entity<BoughtEnergyProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get amount(): string {
    return this.amount;
  }

  get price(): string {
    return this.price;
  }

  set amount(value: string) {
    this.props.amount = value;
  }

  set price(value: string) {
        this.props.price = value;
  }

    private constructor (props: BoughtEnergyProps, id?: UniqueEntityID) {
      super(props, id);
    }

    public static create (props: BoughtEnergyProps, id?: UniqueEntityID): BoughtEnergy {
      return new BoughtEnergy(props, id);
    }
}   