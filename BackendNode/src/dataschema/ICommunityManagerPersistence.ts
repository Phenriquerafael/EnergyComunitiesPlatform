import { User as PrismaUser } from "@prisma/client";
import { Community as PrismaCommunity } from "@prisma/client";

export default interface IProsumerPersistence {
    id: string;
    userId: string;
    user?: PrismaUser;
    communityId: string;
    community?: PrismaCommunity;
}