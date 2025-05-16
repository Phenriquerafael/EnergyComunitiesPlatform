import { CommunityManager } from "../domain/CommunityManager/CommunityManager";
import ICommunityManagerDTO from "../dto/ICommunityManagerDTO";
import ICommunityDTO from "../dto/ICommunityDTO";
import { IUserDTO } from "../dto/IUserDTO";
import { Community } from "../domain/Community/Community";
import { User } from "../domain/User/user";
import { CommunityMap } from "./CommunityMap";
import { UserMap } from "./UserMap";
import { Result } from "../core/logic/Result";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import {User as PrismaUser} from "@prisma/client";
import { Community as PrismaCommunity } from "@prisma/client";
import ICommunityManagerPersistence from "../dataschema/ICommunityManagerPersistence";

export class CommunityManagerMap {
  public static toDTO(communityManager: CommunityManager): ICommunityManagerDTO {
    return {
        id: communityManager.id.toString(),
        communityId: communityManager.community.id.toString(),
        userId: communityManager.user.id.toString(),
    };
  }

    public static toDomainFromDto(id: string, community: Community, user: User): Result<CommunityManager> {
        const communityManagerProps = {
            community: community,
            user: user,
        };

        return CommunityManager.create(communityManagerProps,new UniqueEntityID(id));
    }

    public static async toDomain(raw: ICommunityManagerPersistence & {user: PrismaUser}& {community: PrismaCommunity}): Promise<Result<CommunityManager>> {
      try {
        const communityInstance = (await CommunityMap.toDomain(raw.community)).getValue();
        const userInstance = (await UserMap.toDomain(raw.user)).getValue();
     

        // Criar a entidade Prosumer
        const communityManagerProps = {
          community: communityInstance,
          user: userInstance,
        };
  
        const communityManagerOrError = CommunityManager.create(communityManagerProps, new UniqueEntityID(raw.id));
        if (communityManagerOrError.isFailure) {
          return Result.fail<CommunityManager>(communityManagerOrError.error);
        }
  
        return Result.ok<CommunityManager>(communityManagerOrError.getValue());
      } catch (error) {
        console.error("Error mapping Community Manager:", error);
        return Result.fail<CommunityManager>("Failed to map Community Manager from persistence");
      }
    }


    public static toPersistence(communityManager: CommunityManager): any {
        return {
        id: communityManager.id.toString(),
        communityId: communityManager.community.id.toString(),
        userId: communityManager.user.id.toString(),
        };
    }
}