import { Inject, Service } from 'typedi';
import config from '../../config';
import IBatteryService from './IServices/IBatteryService';
import IBatteryRepo from '../repos/IRepos/IBatteryRepo';
import { Result } from '../core/logic/Result';
import IBatteryDTO from '../dto/IBatteryDTO';
import { BatteryMap } from '../mappers/BatteryMap';

@Service()
export default class BatteryService implements IBatteryService {
  constructor(@Inject(config.repos.battery.name) private batteryRepoInstance: IBatteryRepo) {
    /* console.log('ProsumerBatteryService instantiated'); // Debug */
  }
  public async createBatteries(batteryDTOs: IBatteryDTO[]): Promise<Result<IBatteryDTO[]>> {
    try {
      if (!batteryDTOs || batteryDTOs.length === 0) {
        return Result.fail<IBatteryDTO[]>('Prosumer battery list is required');
      }
      const prosumerBatteries = batteryDTOs.map((batteryDTO) => this.createBattery(batteryDTO));
      const results = await Promise.all(prosumerBatteries);
      const successfulResults = results.filter((result) => result.isSuccess).map((result) => result.getValue());
      const failedResults = results.filter((result) => result.isFailure).map((result) => result.error);
      if (failedResults.length > 0) {
        return Result.fail<IBatteryDTO[]>(`Error creating prosumer batteries: ${failedResults.join(', ')}`);
      }
      return Result.ok<IBatteryDTO[]>(successfulResults);
    } catch (error) {
      console.log('Error creating prosumer batteries: ', error);
      return Result.fail<IBatteryDTO[]>('Error creating prosumer batteries');
    }
  }
  public async deleteBattery(batteryId: string): Promise<Result<void>> {
    try {
      if (!batteryId) {
        return Result.fail<void>('Prosumer battery ID is required');
      }
      const existingBatteryOrError = await this.batteryRepoInstance.findById(batteryId);
      if (existingBatteryOrError.isFailure) {
        return Result.fail<void>('Prosumer battery not found');
      }

      const existingBattery = existingBatteryOrError.getValue();

      const deletedBatteryOrError = await this.batteryRepoInstance.delete(existingBattery.id.toString());
      if (deletedBatteryOrError.isFailure) {
        return Result.fail<void>('Error deleting prosumer battery');
      }

      return Result.ok<void>(undefined);
    } catch (error) {
      console.log('Error deleting prosumer battery: ', error);
      return Result.fail<void>('Error deleting prosumer battery');
    }
  }

  public async createBattery(batteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>> {
    try {
      const prosumerBattery = BatteryMap.toDomainFromDTO(batteryDTO);

      if (prosumerBattery.isFailure) {
        return Result.fail<IBatteryDTO>('Error creating prosumer battery');
      }

      return this.batteryRepoInstance.save(prosumerBattery.getValue()).then((prosumerBattery) => {
        return Result.ok<IBatteryDTO>(BatteryMap.toDTO(prosumerBattery.getValue()));
      });
    } catch (error) {
      console.log('Error creating prosumer battery: ', error);
      return Result.fail<IBatteryDTO>('Error creating prosumer battery');
    }
  }

  public async updateBattery(prosumerBatteryDTO: IBatteryDTO): Promise<Result<IBatteryDTO>> {
    try {
      if (!prosumerBatteryDTO.id) {
        return Result.fail<IBatteryDTO>('Prosumer battery ID is required');
      }
      const existingBatteryOrError = await this.batteryRepoInstance.findById(prosumerBatteryDTO.id);
      if (existingBatteryOrError.isFailure) {
        return Result.fail<IBatteryDTO>('Prosumer battery not found');
      }

      const existingBattery = existingBatteryOrError.getValue();

      if (prosumerBatteryDTO.name) {
        existingBattery.batteryInformation.name = prosumerBatteryDTO.name;
      }
      if (prosumerBatteryDTO.description) {
        existingBattery.batteryInformation.description = prosumerBatteryDTO.description;
      }
      if (prosumerBatteryDTO.efficiency) {
        existingBattery.efficiency.value = prosumerBatteryDTO.efficiency;
      }
      if (prosumerBatteryDTO.maxCapacity) {
        existingBattery.maxCapacity.value = prosumerBatteryDTO.maxCapacity;
      }
      if (prosumerBatteryDTO.initialCapacity) {
        existingBattery.initialCapacity.value = prosumerBatteryDTO.initialCapacity;
      }
      if (prosumerBatteryDTO.maxChargeDischarge) {
        existingBattery.maxChargeDischarge.value = prosumerBatteryDTO.maxChargeDischarge;
      }
      const updatedBattery = await this.batteryRepoInstance.save(existingBattery);

      if (updatedBattery.isFailure) {
        return Result.fail<IBatteryDTO>('Error updating prosumer battery');
      }

      return Result.ok<IBatteryDTO>(BatteryMap.toDTO(updatedBattery.getValue()));
    } catch (error) {
      console.log('Error updating prosumer battery: ', error);
      return Result.fail<IBatteryDTO>('Error updating prosumer battery');
    }
  }

  public async getBattery(prosumerBatteryId: string): Promise<Result<IBatteryDTO>> {
    try {
      if (!prosumerBatteryId) {
        return Result.fail<IBatteryDTO>('Prosumer battery ID is required');
      }
      const existingBatteryOrError = await this.batteryRepoInstance.findById(prosumerBatteryId);
      if (existingBatteryOrError.isFailure) {
        return Result.fail<IBatteryDTO>('Prosumer battery not found');
      }

      const existingBattery = existingBatteryOrError.getValue();

      return Result.ok<IBatteryDTO>(BatteryMap.toDTO(existingBattery));
    } catch (error) {
      console.log('Error getting prosumer battery: ', error);
      return Result.fail<IBatteryDTO>('Error getting prosumer battery');
    }
  }

  public async findAll(): Promise<Result<IBatteryDTO[]>> {
    try {
      const batteriesOrError = await this.batteryRepoInstance.findAll();
      if (batteriesOrError.isFailure) {
        return Result.fail<IBatteryDTO[]>('Error getting all prosumer batteries');
      }
      const batteries = batteriesOrError.getValue();
      const batteryDTOs = batteries.map((battery) => BatteryMap.toDTO(battery));
      return Result.ok<IBatteryDTO[]>(batteryDTOs);
    } catch (error) {
      console.log('Error getting all prosumer batteries: ', error);
      return Result.fail<IBatteryDTO[]>('Error getting all prosumer batteries');
    }
  }
}
