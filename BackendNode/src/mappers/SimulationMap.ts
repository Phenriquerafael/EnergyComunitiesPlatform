
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ISimulationPersistence } from "../dataschema/IProfilePersistence";
import { Community } from "../domain/Community/Community";
import { CommunityDescription } from "../domain/Community/CommunityInformation";
import { Simulation } from "../domain/Simulation/Simulation";
import { Community as PrismaCommunity } from "@prisma/client";
import { ISimulationDTO } from "../dto/IProfileDTO";

export class SimulationMap {

    public static toDto(simulation: Simulation): ISimulationDTO {
        return {
            id: simulation.id.toString(),
            startDate: simulation.props.startDate,
            endDate: simulation.props.endDate,
            description: simulation.props.description || '',
            community: {
                id: simulation.props.community.id.toString(),
                name: simulation.props.community.props.communityInformation.name || ''
            },
            profileLoad: simulation.props.profileLoad,
            stateOfCharge: simulation.props.stateOfCharge,
            photovoltaicEnergyLoad: simulation.props.photovoltaicEnergyLoad
        };
    }

    public static toDomain(rawSimulation: ISimulationPersistence & {community: PrismaCommunity}): Simulation {
        // Import CommunityDescription if not already imported

        const community = Community.create({
            communityInformation: CommunityDescription.create({
                name: rawSimulation.community.name || '',
                description: rawSimulation.community.description || ''
            })
            }
        );
        if (community.isFailure) {
            console.log(community.error);
            throw new Error(String(community.error));
        }

        const simulationOrError = Simulation.create({
            startDate: rawSimulation.startDate,
            endDate: rawSimulation.endDate,
            description: rawSimulation.description || '',
            community: community.getValue(),
            profileLoad: rawSimulation.profileLoad,
            stateOfCharge: rawSimulation.stateOfCharge,
            photovoltaicEnergyLoad: rawSimulation.photovoltaicEnergyLoad
        });

        simulationOrError.isFailure ? console.log(simulationOrError.error) : '';
        return simulationOrError.getValue();
    }


    public static toDomainFromDTO(simulationDTO: ISimulationDTO): Simulation {
        const community = Community.create({
            communityInformation: CommunityDescription.create({
                name: simulationDTO.community?.name || '',
                description: simulationDTO.description || ''
            })
        });

        if (community.isFailure) {
            console.log(community.error);
            throw new Error(String(community.error));
        }

        const simulationOrError = Simulation.create({
            startDate: simulationDTO.startDate,
            endDate: simulationDTO.endDate,
            description: simulationDTO.description || '',
            community: community.getValue(),
            profileLoad: simulationDTO.profileLoad,
            stateOfCharge: simulationDTO.stateOfCharge,
            photovoltaicEnergyLoad: simulationDTO.photovoltaicEnergyLoad
        });

        if (simulationOrError.isFailure) {
            console.log(simulationOrError.error);
            throw new Error(String(simulationOrError.error));
        }

        return simulationOrError.getValue();
    }

    public static toPersistence(simulation: Simulation): ISimulationPersistence {
        return {
            id: simulation.id.toString(),
            startDate: simulation.props.startDate,
            endDate: simulation.props.endDate,
            description: simulation.props.description || '',
            communityId: simulation.props.community.id.toString(),
            community: {
                id: simulation.props.community.id.toString(),
                name: simulation.props.community.props.communityInformation.name || '',
                description: simulation.props.community.props.communityInformation.description || ''
            } as PrismaCommunity,
            profileLoad: simulation.props.profileLoad,
            stateOfCharge: simulation.props.stateOfCharge,
            photovoltaicEnergyLoad: simulation.props.photovoltaicEnergyLoad
        };
    }

}