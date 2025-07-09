import { Mapper } from "../core/infra/Mapper";
import { Community } from "../domain/Community/Community";
import { CommunityDescription } from "../domain/Community/CommunityInformation";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import ICommunityDTO from "../dto/ICommunityDTO";
import ICommunityPersistence from "../dataschema/ICommunityPersistence";
import { Result } from "../core/logic/Result";

export class CommunityMap extends Mapper<Community> {
  
  public static toDTO( community: Community): ICommunityDTO {
    return {
      id: community.id.toString(),
        name: community.communityInformation.name,
        description: community.communityInformation.description,
    } as ICommunityDTO;
  }

  public static toDomainFromDTO (communityDTO:ICommunityDTO ): Result<Community> {
  const communityInformation = CommunityDescription.create({
          name: communityDTO.name,
          description: communityDTO.description? communityDTO.description : '',
        });

      const communityProps = {
        communityInformation: communityInformation,
      };
      return Community.create(communityProps,
      new UniqueEntityID(communityDTO.id)
      );
  }

  public static async toDomain (rawCommunity: ICommunityPersistence): Promise<Result<Community>> {
    const communityInformation = CommunityDescription.create({
      name: rawCommunity.name,
      description: rawCommunity.description,
    });

    const prosumerCommunityProps = {
      communityInformation: communityInformation,
    };

    const communityOrError = Community.create(prosumerCommunityProps, new UniqueEntityID(rawCommunity.id));
    if (communityOrError.isFailure) {
      return Result.fail<Community>(communityOrError.error);
    }
    return Result.ok<Community>(communityOrError.getValue());
  }

  public static toPersistence (community: Community): any {
    return {
      id: community.id.toString(),
      name: community.communityInformation.name,
      description: community.communityInformation.description,
      
    }
  }
}