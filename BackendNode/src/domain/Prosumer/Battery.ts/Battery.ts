import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { BatteryDescription as BatteryInformation } from "./BatteryInformation";
import { Efficiency } from "./Efficiency";
import { MaxCapacity as Capacity } from "./MaxCapacity";
import { MaxChargeDischarge } from "./MaxChargeDischarge";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";

interface BatteryProps {
    batteryInformation: BatteryInformation;
    efficiency: Efficiency;
    maxCapacity: Capacity;
    initialCapacity: Capacity;
    maxChargeDischarge: MaxChargeDischarge;
}

export class Battery extends AggregateRoot<BatteryProps> {
    
    get id (): UniqueEntityID {
        return this._id;
    }
    
    get batteryInformation(): BatteryInformation {
        return this.props.batteryInformation;
    }

    get efficiency(): Efficiency {
        return this.props.efficiency;
    }

    get maxCapacity(): Capacity {
        return this.props.maxCapacity;
    }

    get initialCapacity(): Capacity {
        return this.props.initialCapacity;
    }

    get maxChargeDischarge(): MaxChargeDischarge {
        return this.props.maxChargeDischarge;
    }

    constructor(props: BatteryProps, id?: UniqueEntityID) {
        super(props, id);
    }       

    static create(props: BatteryProps, id?: UniqueEntityID): Result<Battery> {
        const guardedProps = [
            { argument: props.batteryInformation, argumentName: 'batteryInformation' },
            { argument: props.efficiency, argumentName: 'efficiency' },
            { argument: props.maxCapacity, argumentName: 'maxCapacity' },
            { argument: props.maxChargeDischarge, argumentName: 'maxChargeDischarge' }
        ];
        
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result.fail(guardResult.message);
        }else {
            const prosumerBattery = new Battery(props, id);
            return Result.ok(prosumerBattery);
        }

    }

}