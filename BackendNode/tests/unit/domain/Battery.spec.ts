import { Battery, BatteryProps } from '../../../src/domain/Prosumer/Battery.ts/Battery';
import { BatteryDescription } from '../../../src/domain/Prosumer/Battery.ts/BatteryInformation';
import { Efficiency } from '../../../src/domain/Prosumer/Battery.ts/Efficiency';
import { MaxCapacity } from '../../../src/domain/Prosumer/Battery.ts/MaxCapacity';
import { MaxChargeDischarge } from '../../../src/domain/Prosumer/Battery.ts/MaxChargeDischarge';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { Result } from '../../../src/core/logic/Result';

describe('Battery Domain', () => {
  let props: BatteryProps;
  let id: UniqueEntityID;

  beforeEach(() => {
    id = new UniqueEntityID();
    props = {
      batteryInformation: new BatteryDescription({ name: 'Test Battery', description: 'Test Description' }),
      efficiency: new Efficiency({ value: '0.9' }),
      maxCapacity: new MaxCapacity({ value: '1000' }),
      initialCapacity: new MaxCapacity({ value: '500' }),
      maxChargeDischarge: new MaxChargeDischarge({ value: '200' }),
    };
  });

  it('should create a valid Battery instance', () => {
    const result = Battery.create(props, id);
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Battery);
    expect(result.getValue().batteryInformation.name).toBe('Test Battery');
  });

  it('should fail to create Battery with null batteryInformation', () => {
    props.batteryInformation = null as any;
    const result = Battery.create(props, id);
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('batteryInformation');
  });

  it('should return correct properties', () => {
    const battery = Battery.create(props, id).getValue();
    expect(battery.batteryInformation).toBe(props.batteryInformation);
    expect(battery.efficiency).toBe(props.efficiency);
    expect(battery.maxCapacity).toBe(props.maxCapacity);
    expect(battery.initialCapacity).toBe(props.initialCapacity);
    expect(battery.maxChargeDischarge).toBe(props.maxChargeDischarge);
  });
});