import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface TimeStampProps {
    intervalOfTime: string; // Minutes
    numberOfIntervals: number;
}

export class TimeStamp extends AggregateRoot<TimeStampProps> {
    get intervaleOfTime (): string {
        return this.props.intervalOfTime;
    }

    get numberOfIntervales (): number {
        return this.props.numberOfIntervals;
    }

    set intervaleOfTime (value: string) {
        this.props.intervalOfTime = value;
    }

    set numberOfIntervales (value: number) {
        this.props.numberOfIntervals = value;
    }

    private constructor (props: TimeStampProps) {
        super(props);
    }

    public static create (props: TimeStampProps): TimeStamp {
        return new TimeStamp(props);
    }
}