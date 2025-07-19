
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ISimulationPersistence } from "../dataschema/IProfilePersistence";
import { Community } from "../domain/Community/Community";
import { CommunityDescription } from "../domain/Community/CommunityInformation";
import { Simulation } from "../domain/Simulation/Simulation";
import { Community as PrismaCommunity } from "@prisma/client";
import { ISimulationDTO } from "../dto/IProfileDTO";
import { ActiveAttributes } from "../domain/Simulation/ActiveAtributes";
import { CommunityMap } from "./CommunityMap";

export class SimulationMap {

    public static toDto(simulation: Simulation): ISimulationDTO {
        return {
            id: simulation.id.toString(),
            startDate: simulation.props.startDate,
            endDate: simulation.props.endDate,
            description: simulation.props.description || '',
            communityId: simulation.props.community.id.toString(),
            activeAttributes: simulation.props.activeAttributes?.map(attr => ({
                prosumerId: attr.prosumerId,
                profileLoad: attr.profileLoad,
                stateOfCharge: attr.stateOfCharge,
                photovoltaicEnergyLoad: attr.photovoltaicEnergyLoad
            })) || [],
        };
    }

    public static async toDomain(rawSimulation: ISimulationPersistence & {community: PrismaCommunity}): Promise<Simulation> {
        // Import CommunityDescription if not already imported

        const community = await CommunityMap.toDomain(rawSimulation.community);

        if (community.isFailure) {
            console.log(community.error);
            throw new Error(String(community.error));
        }

        const simulationOrError = Simulation.create({
            startDate: rawSimulation.startDate,
            endDate: rawSimulation.endDate,
            description: rawSimulation.description || '',
            community: community.getValue(),
            activeAttributes: rawSimulation.activeAttributes?.map(attr =>
                ActiveAttributes.create({
                    prosumerId: attr.prosumerId,
                    profileLoad: attr.profileLoad,
                    stateOfCharge: attr.stateOfCharge,
                    photovoltaicEnergyLoad: attr.photovoltaicEnergyLoad
                })
            ) || [],

        },
            new UniqueEntityID(rawSimulation.id)
            );

        simulationOrError.isFailure ? console.log(simulationOrError.error) : '';
        return simulationOrError.getValue();
    }


    public static toDomainFromDTO(simulationDTO: ISimulationDTO, community: Community): Simulation {


        const simulationOrError = Simulation.create({
            startDate: simulationDTO.startDate,
            endDate: simulationDTO.endDate,
            description: simulationDTO.description || '',
            community: community,
            activeAttributes: simulationDTO.activeAttributes?.map(attr =>
                ActiveAttributes.create({
                    prosumerId: attr.prosumerId,
                    profileLoad: attr.profileLoad,
                    stateOfCharge: attr.stateOfCharge,
                    photovoltaicEnergyLoad: attr.photovoltaicEnergyLoad
                })
            ) || [],
        },
            new UniqueEntityID(simulationDTO.id)
            );

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
            activeAttributes: simulation.props.activeAttributes?.map(attr => ({
                prosumerId: attr.prosumerId,
                profileLoad: attr.profileLoad,
                stateOfCharge: attr.stateOfCharge,
                photovoltaicEnergyLoad: attr.photovoltaicEnergyLoad
            })) || []
        };
    }

}