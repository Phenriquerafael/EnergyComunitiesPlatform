import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { BatteryDescription } from "./BatteryDescription";
import { Efficiency } from "./Efficiency";
import { MaxCapacity } from "./MaxCapacity";
import { MaxChargeDischarge } from "./MaxChargeDischarge";

interface ProsumerBatteryProps {
    batteryDescription: BatteryDescription;
    efficiency: Efficiency;
    maxCapacity: MaxCapacity;
    maxChargeDischarge: MaxChargeDischarge;
}

export class ProsumerBattery extends AggregateRoot<ProsumerBatteryProps> {
    get batteryDescription(): BatteryDescription {
        return this.props.batteryDescription;
    }

    get efficiency(): Efficiency {
        return this.props.efficiency;
    }

    get maxCapacity(): MaxCapacity {
        return this.props.maxCapacity;
    }

    get maxChargeDischarge(): MaxChargeDischarge {
        return this.props.maxChargeDischarge;
    }

    constructor(props: ProsumerBatteryProps) {
        super(props);
    }       

    static create(props: ProsumerBatteryProps): ProsumerBattery {
        return new ProsumerBattery(props);
    }

}