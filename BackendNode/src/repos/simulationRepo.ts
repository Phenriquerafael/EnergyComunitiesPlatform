import { Service } from "typedi";
import ISimulationRepo from "./IRepos/ISimulationRepo";
import { Simulation } from "../domain/Simulation/Simulation";
import prisma from '../../prisma/prismaClient'
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { SimulationMap } from "../mappers/SimulationMap";

@Service()
export default class SimulationRepo implements ISimulationRepo {
    
    public async exists(t: Simulation): Promise<boolean> {
        return prisma.simulation.findUnique({
            where: { id: t.id.toString() },
        }).then(simulation => !!simulation);
    }
    
    public async save(simulation: Simulation): Promise<Simulation> {
        try {
            const rawSimulation = SimulationMap.toPersistence(simulation);
            const existingSimulation = await prisma.simulation.findUnique({
                where: { id: simulation.id.toString() },
            });

            if (!existingSimulation) {
                // Extract communityId and remove it from rawSimulation
                const { communityId, ...simulationData } = rawSimulation;
                const createdSimulation = await prisma.simulation.create({
                    data: {
                        ...simulationData,
                        community: { connect: { id: communityId } }
                    }
                });
                // Fetch the created simulation including the community
                const createdSimulationWithCommunity = await prisma.simulation.findUnique({
                    where: { id: createdSimulation.id },
                    include: { community: true }
                });
                if (!createdSimulationWithCommunity) {
                    throw new Error("Failed to fetch created simulation with community");
                }
                return SimulationMap.toDomain(createdSimulationWithCommunity);
            } else {
    
                // Fetch the updated simulation including the community
                const updatedSimulationWithCommunity = await prisma.simulation.findUnique({
                    where: { id: simulation.id.toString() },
                    include: { community: true }
                });
                if (!updatedSimulationWithCommunity) {
                    throw new Error("Failed to fetch updated simulation with community");
                }
                return SimulationMap.toDomain(updatedSimulationWithCommunity);
            }
            
        } catch (error) {
            console.error("Error saving the simulation: ", error);
            throw new Error("Error saving the simulation");
            
        }
    }


    public async findById(id: string): Promise<Simulation> {
        const simulationRecord = await prisma.simulation.findUnique({
            where: { id },
            include: { community: true }, // Assuming you want to include the community details
        });

        if (!simulationRecord) throw new Error("Simulation not found");
        return SimulationMap.toDomain(simulationRecord);
    }

    public async findAll(): Promise<Simulation[]> {
        const simulationRecords = await prisma.simulation.findMany({
            include: { community: true }
        });
        return simulationRecords.map(record => SimulationMap.toDomain(record));
    }

    public async delete(simulation: Simulation): Promise<void> {
        await prisma.simulation.delete({
            where: { id: simulation.id.toString() },
        });
    }

    public async findByCommunityId(communityId: string): Promise<Simulation[]> {
        const simulations = await prisma.simulation.findMany({
            where: { communityId },
            include: { community: true }, // Include the community object
        });
        return simulations.map(simulation => SimulationMap.toDomain(simulation));
    }

    public async deleteByCommunityId(communityId: string): Promise<void> {
        await prisma.simulation.deleteMany({
            where: { communityId },
        });
    }
}
