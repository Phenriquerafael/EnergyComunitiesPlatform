import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { CommunityDescription } from "./CommunityInformation";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface CommunityProps {
    communityInformation: CommunityDescription;
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

    constructor(props: CommunityProps, id?: UniqueEntityID) {
        super(props, id);
    }       

    static create(props: CommunityProps, id?: UniqueEntityID): Result<Community> {
        const guardedProps = [
            { argument: props.communityInformation, argumentName: 'communityDescription' },
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