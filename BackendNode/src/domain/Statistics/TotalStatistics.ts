import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';

interface TotalStatisticsProps {
  totalLoad: number;
  totalPhotovoltaicEnergyLoad: number;
  totalBoughtEnergy: number;
  totalSoldEnergy: number;
  totalPeerIn: number;
  totalPeerOut: number;
}

export class TotalStatistics extends AggregateRoot<TotalStatisticsProps> {
  /*   get id(): UniqueEntityID {
    return this._id;
  } */

  get totalLoad(): number {
    return this.props.totalLoad;
  }
  get totalPhotovoltaicEnergyLoad(): number {
    return this.props.totalPhotovoltaicEnergyLoad;
  }
  get totalBoughtEnergy(): number {
    return this.props.totalBoughtEnergy;
  }
  get totalSoldEnergy(): number {
    return this.props.totalSoldEnergy;
  }
  get totalPeerIn(): number {
    return this.props.totalPeerIn;
  }
  get totalPeerOut(): number {
    return this.props.totalPeerOut;
  }

  private constructor(props: TotalStatisticsProps) {
    super(props);
  }

  public static create(props: TotalStatisticsProps): Result<TotalStatistics> {
    return Result.ok(new TotalStatistics(props));
  }
}
