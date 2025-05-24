import BatteryRepo from '../../../src/repos/batteryRepo';
// Update the path below if the actual location is different
import { Battery } from '../../../src/domain/Prosumer/Battery.ts/Battery';
import { BatteryMap } from '../../../src/mappers/BatteryMap';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import prisma from '../../../prisma/prismaClient';

jest.mock('../../prisma/prismaClient', () => ({
  battery: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('BatteryRepo (Isolated)', () => {
  let batteryRepo: BatteryRepo;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = prisma.battery;
    batteryRepo = new BatteryRepo(mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a new battery', async () => {
    const battery = Battery.create({
      batteryInformation: { name: 'Test', description: 'Test' } as any,
      efficiency: { value: 0.9 } as any,
      maxCapacity: { value: 1000 } as any,
      initialCapacity: { value: 500 } as any,
      maxChargeDischarge: { value: 200 } as any,
    }, new UniqueEntityID()).getValue();
    mockPrisma.findUnique.mockResolvedValue(null);
    mockPrisma.create.mockResolvedValue({ id: '1', ...BatteryMap.toPersistence(battery) });

    const result = await batteryRepo.save(battery);
    expect(result.isSuccess).toBe(true);
    expect(mockPrisma.create).toHaveBeenCalled();
  });

  it('should fail to save if Prisma throws an error', async () => {
    const battery = Battery.create({
      batteryInformation: { name: 'Test', description: 'Test' } as any,
      efficiency: { value: 0.9 } as any,
      maxCapacity: { value: 1000 } as any,
      initialCapacity: { value: 500 } as any,
      maxChargeDischarge: { value: 200 } as any,
    }, new UniqueEntityID()).getValue();
    mockPrisma.findUnique.mockRejectedValue(new Error('DB Error'));

    const result = await batteryRepo.save(battery);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Error saving battery');
  });
});