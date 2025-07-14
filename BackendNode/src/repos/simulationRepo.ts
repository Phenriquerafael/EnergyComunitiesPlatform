import { Service } from "typedi";
import ISimulationRepo from "./IRepos/ISimulationRepo";
import { Simulation } from "../domain/Simulation/Simulation";
import prisma from '../../prisma/prismaClient'
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { SimulationMap } from "../mappers/SimulationMap";
import { Result } from "../core/logic/Result";

@Service()
export default class SimulationRepo implements ISimulationRepo {
    
public async exists(t: Simulation): Promise<boolean> {
        return prisma.simulation.findUnique({
            where: { id: t.id.toString() },
        }).then(simulation => !!simulation);
    }

public async save(simulation: Simulation): Promise<Result<Simulation>> {
    try {
        const rawSimulation = SimulationMap.toPersistence(simulation);
        const existingSimulation = await prisma.simulation.findUnique({
            where: { id: rawSimulation.id },
        });

        const activeAttributesCreate = rawSimulation.activeAttributes?.map(attr => ({
            prosumerId: attr.prosumerId,
            profileLoad: attr.profileLoad,
            stateOfCharge: attr.stateOfCharge,
            photovoltaicEnergyLoad: attr.photovoltaicEnergyLoad,
        })) ?? [];

        let savedSimulation;

        if (!existingSimulation) {
            // CREATE
            savedSimulation = await prisma.simulation.create({
                data: {
                    id: rawSimulation.id,
                    startDate: rawSimulation.startDate,
                    endDate: rawSimulation.endDate,
                    description: rawSimulation.description,
                    communityId: rawSimulation.communityId ? String(rawSimulation.communityId) : null,
                    activeAttributes: {
                        create: activeAttributesCreate,
                    },
                },
                include: {
                    activeAttributes: true,
                    community: true,
                },
            });
        } else {
            // UPDATE: precisa remover os activeAttributes existentes antes de recriar
            await prisma.activeAttributes.deleteMany({
                where: { simulationId: rawSimulation.id },
            });

            savedSimulation = await prisma.simulation.update({
                where: { id: rawSimulation.id },
                data: {
                    startDate: rawSimulation.startDate,
                    endDate: rawSimulation.endDate,
                    description: rawSimulation.description,
                    communityId: rawSimulation.communityId ? String(rawSimulation.communityId) : null,
                    activeAttributes: {
                        create: activeAttributesCreate,
                    },
                },
                include: {
                    activeAttributes: true,
                    community: true,
                },
            });
        }

        return Result.ok<Simulation>(SimulationMap.toDomain(savedSimulation));
    } catch (error) {
        console.error("Error saving the simulation: ", error);
        return Result.fail<Simulation>("Error saving the simulation");
    }
}

    


    public async findById(id: string): Promise<Result<Simulation>> {
        try {
            const simulation = await prisma.simulation.findUnique({
                where: { id: String(id) },
                include: { community: true , activeAttributes: true}
            });
            if (!simulation) {
                return Result.fail<Simulation>("Simulation was not found");
            }
            return Result.ok<Simulation>(SimulationMap.toDomain(simulation));
        } catch (error) {
            console.error("Error finding simulation by ID: ", error);
            return Result.fail<Simulation>("Error finding simulation by ID");
        }
    }

    public async findAll(): Promise<Result<Simulation[]>> {
        try {
            const simulations = await prisma.simulation.findMany({
                include: { community: true, activeAttributes: true }
            });
            if (!simulations) {
                return Result.fail<Simulation[]>("No simulations found");
            }
            const simulationOrErrors = simulations.map((simulation) => SimulationMap.toDomain(simulation));
/*             const failedSimulations = simulationOrErrors.filter((simulation) => simulation);
            if (failedSimulations.length > 0) {
                return Result.fail<Simulation[]>(
                    "Error converting some simulations to domain objects"
                );
            } */
            const validSimulations = simulationOrErrors.map((simulation) => simulation);
            return Result.ok<Simulation[]>(validSimulations);
        } catch (error) {
            console.error("Error finding all simulations: ", error);
            return Result.fail<Simulation[]>("Error finding all simulations");
        }
    }

    public async delete(simulation: string): Promise<Result<void>> {
        try {
            const deletedSimulation = await prisma.simulation.delete({
                where: { id: simulation },
            });
            if (!deletedSimulation) {
                return Result.fail<void>("Simulation not found for deletion");
            }
            return Result.ok<void>(undefined);
        } catch (error) {
            console.error("Error deleting simulation: ", error);
            return Result.fail<void>("Error deleting simulation");
        }
    }

    public async deleteAll(): Promise<Result<void>> {
        try {
            const deleteResult = prisma.simulation.deleteMany();
            return Result.ok<void>(undefined);
        } catch (error) {
            console.error("Error deleting all simulations: ", error);
            return Result.fail<void>("Error deleting all simulations");
        }
    }




}
