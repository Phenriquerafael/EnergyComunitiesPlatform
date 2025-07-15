import { useList } from "@refinedev/core";
import { ISimulationDTO } from "../../../interfaces";
import SimulationTableBody from "./SimulationsTableBody";


export const RecentSimulations: React.FC = () => {
    const { data, refetch } = useList<ISimulationDTO>({
        resource: "simulations/all",
    });

    const simulations = data?.data.data ?? [];

    console.log("Recent Simulations Data:", simulations);

    const edit = (resource: string, id: string | number) => {
        // rota de edição
    };

    const show = (resource: string, id: string | number) => {
        // rota de detalhe
    };

    const handleDelete = async (id: string | number) => {
        // chamada de delete
    };

    return (
        <SimulationTableBody
            filtered={simulations}
            edit={edit}
            show={show}
            handleDelete={handleDelete}
        />
    );
};
