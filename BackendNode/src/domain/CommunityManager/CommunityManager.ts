import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { User } from "../User/user";
import { Community } from "../Community/community";

interface CommunityManagerProps {
    community: Community;
    user: User;
}

export class CommunityManager extends AggregateRoot<CommunityManagerProps> {

    get id (): UniqueEntityID {
        return this._id;
    }

    get community(): Community {
        return this.props.community;
    }

    get user(): User {
        return this.props.user;
    }


    set community(value: Community) {
        this.props.community = value;
    }

    set user(value: User) {
        this.props.user = value;
    }

    constructor(props: CommunityManagerProps, id?: UniqueEntityID) {
        super(props, id);
    }       

    static create(props: CommunityManagerProps, id?: UniqueEntityID): Result<CommunityManager> {
        const guardedProps = [
            { argument: props.community, argumentName: 'community' },
            { argument: props.user, argumentName: 'user' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result.fail(guardResult.message);
        }else {
            const prosumer = new CommunityManager(props, id);
            return Result.ok(prosumer);
        }

    }
}
