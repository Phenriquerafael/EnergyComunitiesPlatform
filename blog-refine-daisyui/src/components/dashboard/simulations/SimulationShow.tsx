import React from "react";
import { useOne } from "@refinedev/core";
import { ISimulationDTO, IActiveAtributesDTO, ICommunityDTO } from "../../../interfaces";

interface Props {
    simulation: ISimulationDTO;
}

const SimulationShow: React.FC<Props> = ({ simulation }) => {
    console.log("Simulation Data:", simulation.communityId);
    const { data: communityData, isLoading: isCommunityLoading } = useOne<ICommunityDTO>({
        resource: "communities/id",
        id: simulation.communityId ?? "",
        queryOptions: {
            enabled: !!simulation.communityId,
        },
    });

    return (
        <div className="text-sm space-y-4">
            <div>
                <h5 className="text-xl font-bold mb-2">Simulation Details</h5>
                <div><strong>ID:</strong> {simulation.id}</div>
{/*                 <div><strong>Start Date:</strong> {new Date(simulation.startDate).toLocaleString()}</div>
                <div><strong>End Date:</strong> {new Date(simulation.endDate).toLocaleString()}</div> */}
                <div><strong>Description:</strong> {simulation.description || <em className="text-gray-400">None</em>}</div>
            </div>

            <div>
                <h5 className="text-xl font-bold mb-2">Community</h5>
                {isCommunityLoading ? (
                    <div>Loading community...</div>
                ) : communityData?.data ? (
                    <div className="flex flex-col md:flex-row justify-between border rounded bg-slate-100 p-3 space-y-5">
                        <div><strong>Name:</strong> {communityData.data.name}</div>
                        <div><strong>Description:</strong> {communityData.data.description}</div>
                        <div><strong>Country:</strong> {communityData.data.country}</div>
                        <div><strong>Country Code:</strong> {communityData.data.countryCode}</div>
                    </div>
                ) : (
                    <div className="text-gray-400 italic">No community information.</div>
                )}
            </div>

            <div>
                <h5 className="text-xl font-bold mb-2">Active Attributes</h5>
                {simulation.activeAttributes?.length ? (
                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                        {simulation.activeAttributes.map(
                            (attr: IActiveAtributesDTO, i: number) => (
                                <div
                                    key={i}
                                    className="flex flex-col md:flex-row justify-between border rounded bg-slate-100 p-3 text-sm"
                                >
                                    <div><strong>Prosumer ID:</strong> {attr.prosumerId}</div>
                                    <div><strong>Profile Load:</strong> {attr.profileLoad ? "✔️" : "❌"}</div>
                                    <div><strong>State of Charge:</strong> {attr.stateOfCharge ? "✔️" : "❌"}</div>
                                    <div><strong>Photovoltaic Load:</strong> {attr.photovoltaicEnergyLoad ? "✔️" : "❌"}</div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-gray-400 italic">No active attributes.</div>
                )}
            </div>
        </div>
    );
};

export default SimulationShow;
