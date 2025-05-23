import BatteryService from '../../../src/services/batteryService';
import IBatteryRepo from '../../../src/repos/IRepos/IBatteryRepo';
import { Battery } from '../../../src/domain/Prosumer/Battery.ts/Battery';
import { Result } from '../../../src/core/logic/Result';
import { BatteryMap } from '../../../src/mappers/BatteryMap';
import IBatteryDTO from '../../../src/dto/IBatteryDTO';
import { describe, beforeEach, it, afterEach } from "mocha";

// Mocks
const mockBatteryRepo: jest.Mocked<IBatteryRepo> = {
  save: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const createValidBatteryDTO = (): IBatteryDTO => ({
  id: 'batt-001',
  name: 'Battery A',
  description: 'Solar battery',
  efficiency: '85',
  maxCapacity: '1000',
  initialCapacity: '500',
  maxChargeDischarge: '100',
});

const createDomainBattery = (): Battery => {
  const batteryOrError = Battery.create({
    batteryInformation: { name: 'Battery A', description: 'Solar battery' } as any,
    efficiency: { value: 85 } as any,
    maxCapacity: { value: 1000 } as any,
    initialCapacity: { value: 500 } as any,
    maxChargeDischarge: { value: 100 } as any,
  }, new (require('../../../src/core/domain/UniqueEntityID').UniqueEntityID)('batt-001'));
  return batteryOrError.getValue();
};

describe('BatteryService', () => {
  let batteryService: BatteryService;

  beforeEach(() => {
    batteryService = new BatteryService(mockBatteryRepo);
    jest.clearAllMocks();
  });

  describe('createBattery', () => {
    it('should create and save a battery successfully', async () => {
      const dto = createValidBatteryDTO();
      const domainBattery = createDomainBattery();

      jest.spyOn(BatteryMap, 'toDomainFromDTO').mockReturnValue(Result.ok(domainBattery));
      mockBatteryRepo.save.mockResolvedValue(Result.ok(domainBattery));

      const result = await batteryService.createBattery(dto);

      expect(result.isSuccess).toBe(true);
      expect(mockBatteryRepo.save).toHaveBeenCalledWith(domainBattery);
    });

    it('should fail to create battery with invalid DTO', async () => {
      jest.spyOn(BatteryMap, 'toDomainFromDTO').mockReturnValue(Result.fail('Invalid data'));

      const result = await batteryService.createBattery({} as IBatteryDTO);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Error creating prosumer battery');
    });
  });

  describe('deleteBattery', () => {
    it('should delete battery if it exists', async () => {
      mockBatteryRepo.findById.mockResolvedValue(Result.ok(createDomainBattery()));
      mockBatteryRepo.delete.mockResolvedValue(Result.ok());

      const result = await batteryService.deleteBattery('batt-001');

      expect(result.isSuccess).toBe(true);
      expect(mockBatteryRepo.delete).toHaveBeenCalledWith('batt-001');
    });

    it('should fail if battery does not exist', async () => {
      mockBatteryRepo.findById.mockResolvedValue(Result.fail('Not found'));

      const result = await batteryService.deleteBattery('batt-404');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Prosumer battery not found');
    });
  });

  describe('getBattery', () => {
    it('should return battery DTO if found', async () => {
      const battery = createDomainBattery();
      mockBatteryRepo.findById.mockResolvedValue(Result.ok(battery));
      jest.spyOn(BatteryMap, 'toDTO').mockReturnValue(createValidBatteryDTO());

      const result = await batteryService.getBattery('batt-001');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().id).toBe('batt-001');
    });

    it('should fail if battery not found', async () => {
      mockBatteryRepo.findById.mockResolvedValue(Result.fail('Not found'));

      const result = await batteryService.getBattery('batt-404');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Prosumer battery not found');
    });
  });

  describe('findAll', () => {
    it('should return all batteries as DTOs', async () => {
      const battery = createDomainBattery();
      mockBatteryRepo.findAll.mockResolvedValue(Result.ok([battery]));
      jest.spyOn(BatteryMap, 'toDTO').mockReturnValue(createValidBatteryDTO());

      const result = await batteryService.findAll();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toHaveLength(1);
    });

    it('should fail if repo returns error', async () => {
      mockBatteryRepo.findAll.mockResolvedValue(Result.fail('Repo error'));

      const result = await batteryService.findAll();

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Error getting all prosumer batteries');
    });
  });

  describe('updateBattery', () => {
    it('should update existing battery and return DTO', async () => {
      const dto = createValidBatteryDTO();
      const battery = createDomainBattery();

      mockBatteryRepo.findById.mockResolvedValue(Result.ok(battery));
      mockBatteryRepo.save.mockResolvedValue(Result.ok(battery));
      jest.spyOn(BatteryMap, 'toDTO').mockReturnValue(dto);

      const result = await batteryService.updateBattery(dto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().name).toBe('Battery A');
    });

    it('should fail if battery does not exist', async () => {
      mockBatteryRepo.findById.mockResolvedValue(Result.fail('Not found'));

      const result = await batteryService.updateBattery(createValidBatteryDTO());

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Prosumer battery not found');
    });
  });
});
