import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface TimeStampProps {
    intervaleOfTime: string; // Minutes
    numberOfIntervales: number;
}

export class TimeStamp extends AggregateRoot<TimeStampProps> {
    get intervaleOfTime (): string {
        return this.props.intervaleOfTime;
    }

    get numberOfIntervales (): number {
        return this.props.numberOfIntervales;
    }

    set intervaleOfTime (value: string) {
        this.props.intervaleOfTime = value;
    }

    set numberOfIntervales (value: number) {
        this.props.numberOfIntervales = value;
    }

    private constructor (props: TimeStampProps) {
        super(props);
    }

    public static create (props: TimeStampProps): TimeStamp {
        return new TimeStamp(props);
    }
}