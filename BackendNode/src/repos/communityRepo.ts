import { Service } from "typedi";
import ICommunityRepo from "./IRepos/ICommunityRepo";
import { Result } from "../core/logic/Result";
import { Community } from "../domain/Community/Community";
import prisma from "../../prisma/prismaClient";
import { CommunityMap } from "../mappers/CommunityMap";

@Service()
export default class CommunityRepo implements ICommunityRepo {
    public async save(community: Community): Promise<Result<Community>> {
        try {
            const rawCommunity = CommunityMap.toPersistence(community);
            const existingCommunity = await prisma.community.findUnique({
                where: { id: community.id.toString() },
            });

            if (!existingCommunity) {
                const createdCommunity = await prisma.community.create({ data: rawCommunity });
                const communityOrError = CommunityMap.toDomainFromDTO(createdCommunity);
                if (communityOrError.isFailure) {
                    return Result.fail<Community>(communityOrError.error);
                }
                return Result.ok<Community>(communityOrError.getValue());
            } else {
                const updatedCommunity = await prisma.community.update({
                    where: { id: community.id.toString() },
                    data: rawCommunity,
                });
                return Result.ok<Community>(CommunityMap.toDomainFromDTO(updatedCommunity).getValue()); 
            }
        } catch (error) {
            console.error("Error saving the community: ", error);
            return Result.fail<Community>("Error saving the community");
        }
    }
    public async findById(id: string): Promise<Result<Community>> {
        try {
            const community = await prisma.community.findUnique({
                where: { id: String(id) },
            });
            if (!community) {
                return Result.fail<Community>("Community was not found");
            }
            const communityOrError = CommunityMap.toDomainFromDTO(community);
            if (communityOrError.isFailure) {
                return Result.fail<Community>(communityOrError.error);
            }
            return Result.ok<Community>(communityOrError.getValue());
        } catch (error) {
            console.error("Error finding community by ID: ", error);
            return Result.fail<Community>("Error finding community by ID");
            
        }
    }
    public async findAll(): Promise<Result<Community[]>> {
        const communities = await prisma.community.findMany();
        if (!communities) {
            return Result.fail<Community[]>("No communities found");
        }
        const communityOrErrors = communities.map((community) => CommunityMap.toDomainFromDTO(community));
        const failedBatteries = communityOrErrors.filter((community) => community.isFailure);
        if (failedBatteries.length > 0) {
            return Result.fail<Community[]>(
                "Error converting some communities to domain objects"
            );
        }
        const validBatteries = communityOrErrors.map((community) => community.getValue());
        return Result.ok<Community[]>(validBatteries);
    }

    public async delete(communityId: string): Promise<Result<void>> {
        try {
            await prisma.community.delete({
                where: { id: communityId },
            });
            return Result.ok<void>();
        } catch (error) {
            console.error("Error deleting the community: ", error);
            return Result.fail<void>("Error deleting the community");
        }
    }

}