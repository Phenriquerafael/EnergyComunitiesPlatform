import { AggregateRoot } from "../../../core/domain/AggregateRoot";

interface TimeStampProps {
    intervalOfTime: string; // Minutes
    numberOfIntervals: number;
}

export class TimeStamp extends AggregateRoot<TimeStampProps> {
    get intervalOfTime (): string {
        return this.props.intervalOfTime;
    }

    get numberOfIntervals (): number {
        return this.props.numberOfIntervals;
    }

    set intervalOfTime (value: string) {
        this.props.intervalOfTime = value;
    }

    set numberOfIntervals (value: number) {
        this.props.numberOfIntervals = value;
    }

    private constructor (props: TimeStampProps) {
        super(props);
    }

    public static create (props: TimeStampProps): TimeStamp {
        return new TimeStamp(props);
    }
/* 
    public toString (): string {
        return `TimeStamp: { intervalOfTime: ${this.props.intervalOfTime}, numberOfIntervals: ${this.props.numberOfIntervals} }`;
    } */
}