import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { CommunityDescription } from "./CommunityInformation";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface CommunityProps {
    communityInformation: CommunityDescription;
    country?: string; 
    countryCode?: string; 
}

export class Community extends AggregateRoot<CommunityProps> {
    
    get id (): UniqueEntityID {
        return this._id;
    }
    
    get communityInformation(): CommunityDescription {
        return this.props.communityInformation;
    }

    set communityInformation(value: CommunityDescription) {
        this.props.communityInformation = value;
    }

    get country(): string | undefined {
        return this.props.country;
    }

    get countryCode(): string | undefined {
        return this.props.countryCode;
    }

    constructor(props: CommunityProps, id?: UniqueEntityID) {
        super(props, id);
    }       

    static create(props: CommunityProps, id?: UniqueEntityID): Result<Community> {
        const guardedProps = [
            { argument: props.communityInformation.name, argumentName: 'name' },
            { argument: props.communityInformation.description, argumentName: 'description' },
        ];
        
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result.fail(guardResult.message);
        }else {
            const community = new Community(props, id);
            return Result.ok(community);
        }

    }

}