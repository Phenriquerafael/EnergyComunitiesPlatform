import { BaseKey, useList, useDelete } from "@refinedev/core";
import { ISimulationDTO } from "../../../interfaces";
import SimulationTableBody from "./SimulationsTableBody";
import { message } from "antd";



export const RecentSimulations: React.FC = () => {
    const { data, refetch } = useList<ISimulationDTO>({
        resource: "simulations/all",
    });

    const simulations = data?.data ?? [];

    //console.log("Recent Simulations Data:", simulations);

    const edit = (resource: string, id: string | number) => {
        // rota de edição
    };

    const show = (resource: string, id: string | number) => {
        // rota de detalhe
    };

    const { mutate: deleteOne } = useDelete();

    const handleDelete = async (id: BaseKey) => {
        deleteOne(
        {
            resource: "simulations/id",
            id,
        },
        {
            onSuccess: () => {
            message.success("Simulation deleted successfully!"); // Mensagem de sucesso
            refetch(); // Recarrega a lista após sucesso
            },
            onError: (error) => {
            message.error(
                `Failed to delete simulation: ${error.message || "Unknown error"}`
            ); // Mensagem de erro
            },
        }
        );
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


