import { User as PrismaUser } from "@prisma/client";
import { Battery as PrismaBattery } from "@prisma/client";

export default interface IProsumerPersistence {
    id: string;
    userId: string;
    user?: PrismaUser;
    batteryId: string;
    battery?: PrismaBattery;
}