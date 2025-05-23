/* import BatteryRepo from '../../../src/services/batteryService';
import { PrismaClient } from '@prisma/client';
import { Battery } from '../../../src/domain/Prosumer/Battery.ts/Battery';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { Container } from '../../../src/container';
import BatteryService from '../../../src/services/batteryService';
import IBatteryDTO from '../../../src/dto/IBatteryDTO';
import { Result } from '../../../src/core/logic/Result';
import config from '../../../config';


const prisma = new PrismaClient({
  datasources: { db: { url: 'file:./test.db' } },
});

describe('BatteryService (Non-Isolated)', () => {
  let batteryService: BatteryService;
  let batteryRepo: BatteryRepo;

  beforeAll(async () => {
    // Initialize Prisma for the test database
    await prisma.$connect();
    await prisma.battery.deleteMany();

    // Set up the test-specific PrismaClient in the Container
    Container.set('prisma', prisma);

    // Set up real dependencies with TypeDI
    batteryRepo = new BatteryRepo(prisma.battery);
    Container.set(config.repos.battery.name, batteryRepo);
    batteryService = new BatteryService(batteryRepo);
    Container.set(config.services.battery.name, batteryService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await prisma.battery.deleteMany();
  });

  it('should create and retrieve a battery using real database', async () => {
    const batteryDTO: IBatteryDTO = {
      id: new UniqueEntityID().toString(),
      name: 'Test Battery',
      description: 'Test Description',
      efficiency: '0.9',
      maxCapacity: '1000',
      initialCapacity: '500',
      maxChargeDischarge: '200',
    };

    // Create a battery using the real service and repo
    const createResult = await batteryService.createBattery(batteryDTO);
    expect(createResult.isSuccess).toBe(true);
    const createdBattery = createResult.getValue();
    expect(createdBattery.name).toBe('Test Battery');
    expect(createdBattery.efficiency).toBe(0.9);

    // Retrieve the battery using the real service and repo
    const getResult = await batteryService.getBattery(createdBattery.id);
    expect(getResult.isSuccess).toBe(true);
    const retrievedBattery = getResult.getValue();
    expect(retrievedBattery.id).toBe(createdBattery.id);
    expect(retrievedBattery.name).toBe('Test Battery');
  });

  it('should fail to retrieve a non-existent battery', async () => {
    const getResult = await batteryService.getBattery('non-existent-id');
    expect(getResult.isFailure).toBe(true);
    expect(getResult.error).toBe('Prosumer battery not found');
  });
}); */