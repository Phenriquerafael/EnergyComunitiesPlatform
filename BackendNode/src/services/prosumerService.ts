import { Inject, Service } from "typedi";
import config from "../../config";
import IProsumerRepo from "../repos/IRepos/IProsumerRepo";
import IProsumerService from "./IServices/IProsumerService";
import { Result } from "../core/logic/Result";
import IProsumerDTO, { IProsumerDataDTO } from "../dto/IProsumerDTO";
import { ProsumerMap } from "../mappers/ProsumerMap";
import { Battery } from "../domain/Prosumer/Battery.ts/Battery";
import IBatteryRepo from "../repos/IRepos/IBatteryRepo";
import IUserRepo from "../repos/IRepos/IUserRepo";
import ICommunityRepo from "../repos/IRepos/ICommunityRepo";
import { Community } from "../domain/Community/Community";

@Service()
export default class ProsumerService implements IProsumerService {
  constructor(
    @Inject(config.repos.prosumer.name) private prosumerRepo: IProsumerRepo,
    @Inject(config.repos.battery.name) private batteryRepo: IBatteryRepo,
    @Inject(config.repos.user.name) private userRepo: IUserRepo,
    @Inject(config.repos.community.name) private communityRepo: ICommunityRepo,

  ) {
    /* console.log('ProsumerService instantiated'); // Debug */
    }

    public async createProsumer(prosumerDTO: IProsumerDTO): Promise<Result<IProsumerDTO>> {
        try {
            let prosumerOrError = await this.prosumerRepo.findByUserId(prosumerDTO.userId);
            if (prosumerOrError.isSuccess) {
                return Result.fail<IProsumerDTO>("Prosumer already exists");
            }

            const batteryOrError = await this.batteryRepo.findById(prosumerDTO.batteryId);
            if (batteryOrError.isFailure) {
                return Result.fail<IProsumerDTO>("Battery doens't exist");
            }

            let communityOrError = { isSuccess: true, getValue: () => (undefined) }; // Default to null community
            if (prosumerDTO.communityId !== undefined) {
                communityOrError = await this.communityRepo.findById(prosumerDTO.communityId);
                if (communityOrError.isSuccess === false) {
                    return Result.fail<IProsumerDTO>("Community doesn't exist");
                }
                prosumerDTO.communityId = communityOrError.getValue().id.toString();
            }

            const userOrError = await this.userRepo.findById(prosumerDTO.userId);
/*             if (userOrError.isFailure) {
                return Result.fail<IProsumerDTO>("User doesn't exist");
            } */

            prosumerOrError = ProsumerMap.toDomainFromDto(prosumerDTO.id,batteryOrError.getValue(), userOrError,communityOrError.getValue());   

            if (prosumerOrError.isFailure) {
                return Result.fail<IProsumerDTO>("Error creating prosumer");
            }

            const prosumer = prosumerOrError.getValue();
            const savedProsumer = await this.prosumerRepo.save(prosumer);
            if (savedProsumer.isFailure) {
                return Result.fail<IProsumerDTO>("Error saving prosumer");
            }
            return Result.ok<IProsumerDTO>(ProsumerMap.toDTO(savedProsumer.getValue()));
        } catch (error) {
            console.log("Error creating prosumer: ", error);
            return Result.fail<IProsumerDTO>("Error creating prosumer");
            
        }
    }

    public async updateProsumer(prosumerDTO: IProsumerDTO): Promise<Result<IProsumerDTO>> {
        try {
            const prosumerOrError = await this.prosumerRepo.findById(prosumerDTO.id);
            if (prosumerOrError.isFailure) {
                return Result.fail<IProsumerDTO>("Prosumer doesn't exist");
            }
            if (prosumerOrError.getValue().battery.id.toString() !== prosumerDTO.batteryId && prosumerDTO.batteryId !== undefined) {
                const batteryOrError = await this.batteryRepo.findById(prosumerDTO.batteryId);
                if (batteryOrError.isFailure) {
                    return Result.fail<IProsumerDTO>("Battery doesn't exist");
                }
                prosumerOrError.getValue().battery = batteryOrError.getValue();
            }
            if (prosumerOrError.getValue().user.id.toString() !== prosumerDTO.userId && prosumerDTO.userId !== undefined) {
                 const userOrError = await this.userRepo.findById(prosumerDTO.userId);
/*                if (userOrError.isFailure) {
                    return Result.fail<IProsumerDTO>("User doesn't exist");
                } */
               
                prosumerOrError.getValue().user = userOrError/* .getValue() */ ;
            }

            if (prosumerDTO.communityId !== undefined) {
                const communityOrError = await this.communityRepo.findById(prosumerDTO.communityId);
                if (communityOrError.isFailure) {
                    return Result.fail<IProsumerDTO>("Community doesn't exist");
                }
                prosumerOrError.getValue().community = communityOrError.getValue();
            }

            const updatedProsumer = await this.prosumerRepo.save(prosumerOrError.getValue());
            if (updatedProsumer.isFailure) {
                return Result.fail<IProsumerDTO>("Error updating prosumer");
            }
            return Result.ok<IProsumerDTO>(ProsumerMap.toDTO(updatedProsumer.getValue()));
        } catch (error) {
            console.log("Error updating prosumer: ", error);
            return Result.fail<IProsumerDTO>("Error updating prosumer");
            
        }
    }

    public async getProsumer(prosumerId: string): Promise<Result<IProsumerDTO>> {
        try {
         const prosumerOrError = await this.prosumerRepo.findById(prosumerId);
         if (prosumerOrError.isFailure) {
                return Result.fail<IProsumerDTO>("Prosumer doesn't exist");
            }
            return Result.ok<IProsumerDTO>(ProsumerMap.toDTO(prosumerOrError.getValue()));   
        } catch (error) {
            console.log("Error getting prosumer: ", error);
            return Result.fail<IProsumerDTO>("Error getting prosumer");
            
        }
    }

    public async findAll(): Promise<Result<IProsumerDTO[]>> {
        try {
            const promsumersOrError = await this.prosumerRepo.findAll();
            if (promsumersOrError.isFailure) {
                return Result.fail<IProsumerDTO[]>("Error getting all promsumers");
            }
            const promsumers = promsumersOrError.getValue();
            const promsumersDTO = promsumers.map((prosumer) => ProsumerMap.toDTO(prosumer));
            return Result.ok<IProsumerDTO[]>(promsumersDTO);
        } catch (error) {
            console.log("Error getting all promsumers: ", error);
            return Result.fail<IProsumerDTO[]>("Error getting all promsumers");
            
        }
    }

    public async findByUserId(userId: string): Promise<Result<IProsumerDTO>> {
        try {
            const prosumerOrError = await this.prosumerRepo.findByUserId(userId);
            if (prosumerOrError.isFailure) {
                return Result.fail<IProsumerDTO>("Prosumer doesn't exist");
            }
            return Result.ok<IProsumerDTO>(ProsumerMap.toDTO(prosumerOrError.getValue()));
        } catch (error) {
            console.log("Error finding prosumer by userId: ", error);
            return Result.fail<IProsumerDTO>("Error finding prosumer by userId");
            
        }
    }

    public async findByBatteryId(batteryId: string): Promise<Result<IProsumerDTO>> {
        try {
            const prosumerOrError = await this.prosumerRepo.findByBatteryId(batteryId);
            if (prosumerOrError.isFailure) {
                return Result.fail<IProsumerDTO>("Prosumer doesn't exist");
            }
            return Result.ok<IProsumerDTO>(ProsumerMap.toDTO(prosumerOrError.getValue()));
        } catch (error) {
            console.log("Error finding prosumer by batteryId: ", error);
            return Result.fail<IProsumerDTO>("Error finding prosumer by batteryId");
            
        }
    }

    public async findByCommunityId(communityId: string): Promise<Result<IProsumerDataDTO[]>> {
        try {
            const prosumersOrError = await this.prosumerRepo.findByCommunityId(communityId);
            if (prosumersOrError.isFailure) {
                return Result.fail<IProsumerDataDTO[]>("Prosumer doesn't exist");
            }
            const prosumers = prosumersOrError.getValue();
            const prosumersDTO = prosumers.map((prosumer) => ProsumerMap.toDTO2(prosumer));
            return Result.ok<IProsumerDataDTO[]>(prosumersDTO);
        } catch (error) {
            console.log("Error finding prosumers by communityId: ", error);
            return Result.fail<IProsumerDataDTO[]>("Error finding prosumers by communityId");
            
        }
    }

    public async findAll2(): Promise<Result<IProsumerDataDTO[]>> {
        try {
            const prosumersOrError = await this.prosumerRepo.findAll();
            if (prosumersOrError.isFailure) {
                return Result.fail<IProsumerDataDTO[]>("Error finding all prosumers");
            }
            const prosumers = prosumersOrError.getValue();
            const prosumersDTO = prosumers.map((prosumer) => ProsumerMap.toDTO2(prosumer));
            return Result.ok<IProsumerDataDTO[]>(prosumersDTO);
        } catch (error) {
            console.log("Error finding all prosumers: ", error);
            return Result.fail<IProsumerDataDTO[]>("Error finding all prosumers");
            
        }
    }

    public async deleteProsumer(prosumerId: string): Promise<Result<void>> {
        try {
            const prosumerOrError = await this.prosumerRepo.findById(prosumerId);
            if (prosumerOrError.isFailure) {
                return Result.fail<void>("Prosumer doesn't exist");
            }
            const deleteResult = await this.prosumerRepo.deleteProsumer(prosumerId);
            if (deleteResult.isFailure) {
                return Result.fail<void>("Error deleting prosumer");
            }
            return Result.ok<void>();
        } catch (error) {
            console.log("Error deleting prosumer: ", error);
            return Result.fail<void>("Error deleting prosumer");
            
        }
    }

    public async addToCommunity(communityId: string, prosumers: { prosumerId: string }[]): Promise<Result<void>> {
        try {
            const prosumerOrErrors = await Promise.all(
                prosumers.map(async (prosumer) => {
                    const prosumerOrError = await this.prosumerRepo.findById(prosumer.prosumerId);
                    if (prosumerOrError.isFailure) {
                        return Result.fail<void>(`Prosumer with ID ${prosumer.prosumerId} doesn't exist`);
                    }
                    return Result.ok<void>();
                })
            );
            
            await Promise.all(
                prosumers.map(async (prosumer) => {
                    const prosumerOrError = await this.prosumerRepo.findById(prosumer.prosumerId);
                    if (prosumerOrError.isFailure) {
                        return Result.fail<void>(`Prosumer with ID ${prosumer.prosumerId} doesn't exist`);
                    }
                    const prosumerDomain = prosumerOrError.getValue();
                    prosumerDomain.community = (await this.communityRepo.findById(communityId)).getValue();
                    const saveResult = await this.prosumerRepo.save(prosumerDomain);
                    if (saveResult.isFailure) {
                        return Result.fail<void>(`Error saving prosumer with ID ${prosumer.prosumerId} to community`);
                    }
                    
                })
            );
            return Result.ok<void>();

        } catch (error) {
            console.log("Error adding prosumers to community: ", error);
            return Result.fail<void>("Error adding prosumers to community");
            
        }
    }

    public async removeFromCommunity(communityId: string, prosumers: { prosumerId: string }[]): Promise<Result<void>> {
        try {
            const prosumerOrErrors = await Promise.all(
                prosumers.map(async (prosumer) => {
                    const prosumerOrError = await this.prosumerRepo.findById(prosumer.prosumerId);
                    if (prosumerOrError.isFailure) {
                        return Result.fail<void>(`Prosumer with ID ${prosumer.prosumerId} doesn't exist`);
                    }
                    return Result.ok<void>();
                })
            );

            await Promise.all(
                prosumers.map(async (prosumer) => {
                    const prosumerOrError = await this.prosumerRepo.findById(prosumer.prosumerId);
                    if (prosumerOrError.isFailure) {
                        return Result.fail<void>(`Prosumer with ID ${prosumer.prosumerId} doesn't exist`);
                    }
                    const prosumerDomain = prosumerOrError.getValue();
                    prosumerDomain.community = undefined; // Remove community association
                    const saveResult = await this.prosumerRepo.save(prosumerDomain);
                    if (saveResult.isFailure) {
                        return Result.fail<void>(`Error saving prosumer with ID ${prosumer.prosumerId} after removing from community`);
                    }
                    
                })
            );
            return Result.ok<void>();

        } catch (error) {
            console.log("Error removing prosumers from community: ", error);
            return Result.fail<void>("Error removing prosumers from community");
            
        }
    }



}