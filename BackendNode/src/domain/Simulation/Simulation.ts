
import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { Community } from "../Community/Community";
import { ActiveAttributes } from "./ActiveAtributes";

interface SimulationProps {
startDate: string;
endDate: string;
description?: string;
community: Community;
activeAttributes?: ActiveAttributes[];
}

export class Simulation extends AggregateRoot<SimulationProps> {


    get id(): UniqueEntityID {
        return this._id;
    }

    get startDate(): string {
        return this.props.startDate;
    }

    get endDate(): string {
        return this.props.endDate;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get community(): Community {
        return this.props.community;
    }

    get activeAttributes(): ActiveAttributes[] | undefined {
        return this.props.activeAttributes;
    }

    constructor(props: SimulationProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: SimulationProps, id?: UniqueEntityID): Result<Simulation> {
        const guardedProps = [
            { argument: props.startDate, argumentName: 'startDate' },
            { argument: props.endDate, argumentName: 'endDate' },
            { argument: props.community, argumentName: 'community' }

        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Simulation>(guardResult.message);
        } else {
            const simulation = new Simulation(props, id);
            return Result.ok<Simulation>(simulation);
        }
    }


}