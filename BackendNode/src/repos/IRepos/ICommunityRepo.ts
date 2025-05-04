import { Result } from "../../core/logic/Result";
import { Community } from "../../domain/Community/Community";


export default interface ICommunityRepo {
  save(community: Community): Promise<Result<Community>>;
  findById(id: string): Promise<Result<Community>>;
  findAll(): Promise<Result<Community[]>>;
}