
import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { Community } from "../Community/Community";

interface SimulationProps {
startDate: string;
endDate: string;
description?: string;
community: Community;
profileLoad: boolean;
stateOfCharge: boolean;
photovoltaicEnergyLoad: boolean;
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

    get profileLoad(): boolean {
        return this.props.profileLoad ?? false;
    }

    get stateOfCharge(): boolean {
        return this.props.stateOfCharge ?? false;
    }

    get photovoltaicEnergyLoad(): boolean {
        return this.props.photovoltaicEnergyLoad ?? false;
    }

    constructor(props: SimulationProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: SimulationProps, id?: UniqueEntityID): Result<Simulation> {
        const guardedProps = [
            { argument: props.startDate, argumentName: 'startDate' },
            { argument: props.endDate, argumentName: 'endDate' },
            { argument: props.community, argumentName: 'community' },
            { argument: props.profileLoad, argumentName: 'profileLoad' },
            { argument: props.stateOfCharge, argumentName: 'stateOfCharge' },
            { argument: props.photovoltaicEnergyLoad, argumentName: 'photovoltaicEnergyLoad' },

        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Simulation>(guardResult.message);
        } else {
            const simulation = new Simulation(props, id);
            return Result.ok<Simulation>(simulation);
        }
    }

    public toString(): string {
        return `Simulation: { id: ${this._id.toString()},\n
        startDate: ${this.props.startDate},\n
        endDate: ${this.props.endDate},\n
        ${this.props.description? `description: ${this.props.description},\n` : ''}
        community: ${this.props.community.id},\n
        profileLoad: ${this.props.profileLoad},\n
        stateOfCharge: ${this.props.stateOfCharge},\n
        photovoltaicEnergyLoad: ${this.props.photovoltaicEnergyLoad} }\n`;
    }
}