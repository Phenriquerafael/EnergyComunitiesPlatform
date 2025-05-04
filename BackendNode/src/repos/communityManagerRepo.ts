import { Service } from "typedi";
import ICommunityManagerRepo from "./IRepos/ICommunityManagerRepo";
import { Result } from "../core/logic/Result";
import { CommunityManager } from "../domain/CommunityManager/CommunityManager";
import prisma from "../../prisma/prismaClient";
import { CommunityManagerMap } from "../mappers/CommunityManagerMap";

@Service()
export default class CommunityManagerRepo implements ICommunityManagerRepo {
    public async save(communityManager: CommunityManager): Promise<Result<CommunityManager>> {
        try {
            // Mapping the CommunityManager to the persistence format 
            const rawCommunityManager = CommunityManagerMap.toPersistence(communityManager);
            
            // Verify if the CommunityManager already exists
            const existingCommunityManager = await prisma.communityManager.findUnique({
                where: { id: communityManager.id.toString() },
            });
            
            let savedCommunityManager;
            if (!existingCommunityManager) {
                // Create new Community Manager
                savedCommunityManager = await prisma.communityManager.create({
                    data: rawCommunityManager,
                    include: {
                        user: true, // Include the User for mapping
                        community: true, // Include the Community for mapping
                    },
                });
            } else {
                // Update existing Community Manager
                savedCommunityManager = await prisma.communityManager.update({
                    where: { id: communityManager.id.toString() },
                    data: rawCommunityManager,
                    include: {
                        user: true, // Include the User for mapping
                        community: true, // Include the Community for mapping
                    },
                });
            }
            
            return Result.ok<CommunityManager>(savedCommunityManager);
            
        } catch (error) {
            console.log("Error saving communityManager: ", error);
            return Result.fail<CommunityManager>("Error saving communityManager");
            
        }
    }
    public async findById(id: string): Promise<Result<CommunityManager>> {
        try {
            const rawCommunityManager = await prisma.communityManager.findUnique({
                where: { id: id },
                include: {
                    user: true, // Include the User for mapping
                    community: true, // Include the Community for mapping
                },
            });
            
            if (!rawCommunityManager) {
                return Result.fail<CommunityManager>("CommunityManager not found");
            }
            
            const communityManagerOrError = await CommunityManagerMap.toDomain(rawCommunityManager);
            
            if (communityManagerOrError.isFailure) {
                return Result.fail<CommunityManager>(communityManagerOrError.error);
            }
            
            return Result.ok<CommunityManager>(communityManagerOrError.getValue());
        } catch (error) {
            console.log("Error finding communityManager: ", error);
            return Result.fail<CommunityManager>("Error finding communityManager");
            
        }
    }
    public async findAll(): Promise<Result<CommunityManager[]>> {
        try {
            const rawCommunityManagers = await prisma.communityManager.findMany({
                include: {
                    user: true, // Include the User for mapping
                    community: true, // Include the Community for mapping
                },
            });
            
            const communityManagerPromises = rawCommunityManagers.map(async (raw) => {
                const communityManagerOrError = await CommunityManagerMap.toDomain(raw);
                
                if (communityManagerOrError.isFailure) {
                    return Result.fail<CommunityManager>(communityManagerOrError.error);
                }
                
                return Result.ok<CommunityManager>(communityManagerOrError.getValue());
            });
            
            const communityManagersResults = await Promise.all(communityManagerPromises);
            
            return Result.ok<CommunityManager[]>(communityManagersResults.map((result) => result.getValue()));
        } catch (error) {
            console.log("Error finding all communityManagers: ", error);
            return Result.fail<CommunityManager[]>("Error finding all promsumers");
            
        }
    }
    public async findByUserId(userId: string): Promise<Result<CommunityManager>> {
        try {
            const rawCommunityManager = await prisma.communityManager.findUnique({
                where: { userId: userId },
                include: {
                    user: true, // Include the User for mapping
                    community: true, // Include the Community for mapping
                },
            });
            
            if (!rawCommunityManager) {
                return Result.fail<CommunityManager>("CommunityManager not found");
            }
            
            const communityManagerOrError = await CommunityManagerMap.toDomain(rawCommunityManager);
            
            if (communityManagerOrError.isFailure) {
                return Result.fail<CommunityManager>(communityManagerOrError.error);
            }
            
            return Result.ok<CommunityManager>(communityManagerOrError.getValue());
        } catch (error) {
            console.log("Error finding communityManager by user ID: ", error);
            return Result.fail<CommunityManager>("Error finding communityManager by user ID");
            
        }
    }
    public async findByCommunityId(communityId: string): Promise<Result<CommunityManager>> {
        try {
            const rawCommunityManager = await prisma.communityManager.findUnique({
                where: { id: communityId },
                include: {
                    user: true, // Include the User for mapping
                    community: true, // Include the Community for mapping
                },
            });
            
            if (!rawCommunityManager) {
                return Result.fail<CommunityManager>("CommunityManager not found");
            }
            
            const communityManagerOrError = await CommunityManagerMap.toDomain(rawCommunityManager);
            
            if (communityManagerOrError.isFailure) {
                return Result.fail<CommunityManager>(communityManagerOrError.error);
            }
            
            return Result.ok<CommunityManager>(communityManagerOrError.getValue());
        } catch (error) {
            console.log("Error finding communityManager by community ID: ", error);
            return Result.fail<CommunityManager>("Error finding communityManager by community ID");
            
        }
    }
    
}