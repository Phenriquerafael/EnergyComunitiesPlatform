import { Service } from "typedi";
import IBatteryRepo from "./IRepos/IBatteryRepo";
import { Result } from "../core/logic/Result";
import { Battery } from "../domain/Prosumer/Battery.ts/Battery";
import prisma from "../../prisma/prismaClient";
import { BatteryMap } from "../mappers/BatteryMap";

@Service()
export default class BatteryRepo implements IBatteryRepo {
    public async delete(id: string): Promise<Result<void>> {
        try {
            const battery = await prisma.battery.findUnique({
                where: { id: String(id) },
            });
            if (!battery) {
                return Result.fail<void>("Battery not found");
            }
            await prisma.battery.delete({
                where: { id: String(id) },
            });
            return Result.ok<void>(undefined);
        } catch (error) {
            console.error("Error deleting battery: ", error);
            return Result.fail<void>("Error deleting battery");
        }
    }
    public async save(battery: Battery): Promise<Result<Battery>> {
        try {
            const rawBattery = BatteryMap.toPersistence(battery);
            const existingBattery = await prisma.battery.findUnique({
                where: { id: battery.id.toString() },
            });

            if (!existingBattery) {
                const createdBattery = await prisma.battery.create({ data: rawBattery });
                const batteryOrError = BatteryMap.toDomainFromDTO(createdBattery);
                if (batteryOrError.isFailure) {
                    return Result.fail<Battery>(batteryOrError.error);
                }
                return Result.ok<Battery>(batteryOrError.getValue());
            } else {
                const updatedBattery = await prisma.battery.update({
                    where: { id: battery.id.toString() },
                    data: rawBattery,
                });
                return Result.ok<Battery>(BatteryMap.toDomainFromDTO(updatedBattery).getValue()); 
            }
        } catch (error) {
            console.error("Error saving battery: ", error);
            return Result.fail<Battery>("Error saving battery");
        }
    }
    public async findById(id: string): Promise<Result<Battery>> {
        try {
            const battery = await prisma.battery.findUnique({
                where: { id: String(id) },
            });
            if (!battery) {
                return Result.fail<Battery>("Battery not found");
            }
            const batteryOrError = BatteryMap.toDomainFromDTO(battery);
            if (batteryOrError.isFailure) {
                return Result.fail<Battery>(batteryOrError.error);
            }
            return Result.ok<Battery>(batteryOrError.getValue());
        } catch (error) {
            console.error("Error finding battery by ID: ", error);
            return Result.fail<Battery>("Error finding battery by ID");
            
        }
    }
    public async findAll(): Promise<Result<Battery[]>> {
        const batteries = await prisma.battery.findMany();
        if (!batteries) {
            return Result.fail<Battery[]>("No batteries found");
        }
        const batteryOrErrors = batteries.map((battery) => BatteryMap.toDomainFromDTO(battery));
        const failedBatteries = batteryOrErrors.filter((battery) => battery.isFailure);
        if (failedBatteries.length > 0) {
            return Result.fail<Battery[]>(
                "Error converting some batteries to domain objects"
            );
        }
        const validBatteries = batteryOrErrors.map((battery) => battery.getValue());
        return Result.ok<Battery[]>(validBatteries);
    }

}