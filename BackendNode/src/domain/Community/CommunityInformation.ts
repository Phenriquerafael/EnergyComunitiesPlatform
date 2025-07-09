import { AggregateRoot } from "../../core/domain/AggregateRoot";

interface CommunityInformationsProps {
    name: string;
    description?: string;
}

export class CommunityDescription extends AggregateRoot<CommunityInformationsProps> {
    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
    }

    set name(value: string) {
        this.props.name = value;
    }

    set description(value: string) {
        this.props.description = value;
    }

    constructor(props: CommunityInformationsProps) {
        super(props);
    }
    
    static create(props: CommunityInformationsProps): CommunityDescription {
        return new CommunityDescription(props);
    }
}