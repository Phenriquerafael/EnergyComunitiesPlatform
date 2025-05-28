import { Service } from "typedi";
import IProsumerRepo from "./IRepos/IProsumerRepo";
import { Result } from "../core/logic/Result";
import { Prosumer } from "../domain/Prosumer/Prosumer";
import prisma from "../../prisma/prismaClient";
import { ProsumerMap } from "../mappers/ProsumerMap";

@Service()
export default class ProsumerRepo implements IProsumerRepo {
    public async save(prosumer: Prosumer): Promise<Result<Prosumer>> {
        try {
            // Mapear o Prosumer para o formato de persistência
            const rawProsumer = ProsumerMap.toPersistence(prosumer);
            
            // Verificar se o Prosumer já existe
            const existingProsumer = await prisma.prosumer.findUnique({
                where: { id: prosumer.id.toString() },
            });
            
            let savedProsumer;
            if (!existingProsumer) {
                // Criar novo Prosumer
                savedProsumer = await prisma.prosumer.create({
                    data: rawProsumer,
                    include: {
                        user: true, // Incluir o User para o mapeamento
                        battery: true, // Incluir a Battery para o mapeamento
                        community: rawProsumer.community ?? undefined
                    },
                });
            } else {
                // Atualizar Prosumer existente
                savedProsumer = await prisma.prosumer.update({
                    where: { id: prosumer.id.toString() },
                    data: rawProsumer,
                    include: {
                        user: true, // Incluir o User para o mapeamento
                        battery: true, // Incluir a Battery para o mapeamento
                        community: rawProsumer.community ?? undefined
                    },
                });
            }
            
            return Result.ok<Prosumer>(savedProsumer);
            
        } catch (error) {
            console.log("Error saving prosumer: ", error);
            return Result.fail<Prosumer>("Error saving prosumer");
            
        }
    }
    public async findById(id: string): Promise<Result<Prosumer>> {
        try {
            const rawProsumer = await prisma.prosumer.findUnique({
                where: { id: id },
                include: {
                    user: true, // Incluir o User para o mapeamento
                    battery: true, // Incluir a Battery para o mapeamento
                    community: true, // Incluir a Community para o mapeamento
                },
            });
            
            if (!rawProsumer) {
                return Result.fail<Prosumer>("Prosumer not found");
            }
            
            const prosumerOrError = await ProsumerMap.toDomain(rawProsumer);
            
            if (prosumerOrError.isFailure) {
                return Result.fail<Prosumer>(prosumerOrError.error);
            }
            
            return Result.ok<Prosumer>(prosumerOrError.getValue());
        } catch (error) {
            console.log("Error finding prosumer: ", error);
            return Result.fail<Prosumer>("Error finding prosumer");
            
        }
    }
    public async findAll(): Promise<Result<Prosumer[]>> {
        try {
            const rawProsumers = await prisma.prosumer.findMany({
                include: {
                    user: true, // Incluir o User para o mapeamento
                    battery: true, // Incluir a Battery para o mapeamento
                    community: true, // Incluir a Community para o mapeamento
                },
            });
            
            const prosumerPromises = rawProsumers.map(async (raw) => {
                const prosumerOrError = await ProsumerMap.toDomain(raw);
                
                if (prosumerOrError.isFailure) {
                    return Result.fail<Prosumer>(prosumerOrError.error);
                }
                
                return Result.ok<Prosumer>(prosumerOrError.getValue());
            });
            
            const prosumersResults = await Promise.all(prosumerPromises);
            
            return Result.ok<Prosumer[]>(prosumersResults.map((result) => result.getValue()));
        } catch (error) {
            console.log("Error finding all prosumers: ", error);
            return Result.fail<Prosumer[]>("Error finding all promsumers");
            
        }
    }




    public async findByUserId(userId: string): Promise<Result<Prosumer>> {
        try {
            const rawProsumer = await prisma.prosumer.findUnique({
                where: { userId: userId },
                include: {
                    user: true, // Incluir o User para o mapeamento
                    battery: true, // Incluir a Battery para o mapeamento
                    community: true, // Incluir a Community para o mapeamento
                },
            });
            
            if (!rawProsumer) {
                return Result.fail<Prosumer>("Prosumer not found");
            }
            
            const prosumerOrError = await ProsumerMap.toDomain(rawProsumer);
            
            if (prosumerOrError.isFailure) {
                return Result.fail<Prosumer>(prosumerOrError.error);
            }
            
            return Result.ok<Prosumer>(prosumerOrError.getValue());
        } catch (error) {
            console.log("Error finding prosumer by user ID: ", error);
            return Result.fail<Prosumer>("Error finding prosumer by user ID");
            
        }
    }
    public async findByBatteryId(batteryId: string): Promise<Result<Prosumer>> {
        try {
            const rawProsumer = await prisma.prosumer.findUnique({
                where: { id: batteryId },
                include: {
                    user: true, // Incluir o User para o mapeamento
                    battery: true, // Incluir a Battery para o mapeamento
                    community: true, // Incluir a Community para o mapeamento
                },
            });
            
            if (!rawProsumer) {
                return Result.fail<Prosumer>("Prosumer not found");
            }
            
            const prosumerOrError = await ProsumerMap.toDomain(rawProsumer);
            
            if (prosumerOrError.isFailure) {
                return Result.fail<Prosumer>(prosumerOrError.error);
            }
            
            return Result.ok<Prosumer>(prosumerOrError.getValue());
        } catch (error) {
            console.log("Error finding prosumer by battery ID: ", error);
            return Result.fail<Prosumer>("Error finding prosumer by battery ID");
            
        }
    }

public async findByCommunityId(communityId: string): Promise<Result<Prosumer[]>> {
    try {
        const rawProsumers = await prisma.prosumer.findMany({
            where: { communityId },
            include: {
                user: true,
                battery: true,
                community: true,
            },
        });

        const prosumers: Prosumer[] = [];

        for (const raw of rawProsumers) {
            const prosumerOrError = await ProsumerMap.toDomain(raw);

            if (prosumerOrError.isFailure) {
                // Se houver um erro, para e retorna a falha
                return Result.fail<Prosumer[]>(`Erro ao mapear Prosumer: ${prosumerOrError.error}`);
            }

            prosumers.push(prosumerOrError.getValue());
        }

        return Result.ok<Prosumer[]>(prosumers);
    } catch (error) {
        console.error("Erro ao buscar Prosumers por Community ID:", error);
        return Result.fail<Prosumer[]>("Erro ao buscar Prosumers por Community ID");
    }
}


    public async deleteProsumer(prosumerId: string): Promise<Result<void>> {
        try {
            await prisma.prosumer.delete({
                where: { id: prosumerId },
            });
            return Result.ok<void>();
        } catch (error) {
            console.log("Error deleting prosumer: ", error);
            return Result.fail<void>("Error deleting prosumer");
        }
    }
    
}