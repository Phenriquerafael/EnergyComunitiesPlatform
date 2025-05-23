import React, { useEffect, useState } from "react";
import { useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import IBatteryDTO from "../../interfaces";
import { getBatteryById } from "../../services/batteryService";

export const BatteryShow = () => {
  const { edit, list } = useNavigation();
  const { id } = useParams(); // Refine fornece o ID via rota
  const [battery, setBattery] = useState<IBatteryDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        console.log("Fetching battery with ID:", id);
        if (id) {
          const data = await getBatteryById(id);
          setBattery(data);
        }
      } catch (error) {
        console.error("Erro ao buscar bateria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBattery();
  }, [id]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <button
            className="mr-2 btn btn-primary btn-sm btn-ghost"
            onClick={() => list("batteries")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="page-title">Battery Details</h1>
        </div>
        <div className="flex justify-start items-center mt-4">
          <button
            className="flex justify-center items-center btn btn-primary btn-sm text-zinc-50 normal-case font-normal"
            onClick={() => edit("batteries", battery?.id ?? "")}
            disabled={!battery}
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          {loading ? (
            <div>Loading...</div>
          ) : battery ? (
            [
              { label: "ID", key: "id" },
              { label: "Name", key: "name" },
              { label: "Description", key: "description" },
              { label: "Efficiency", key: "efficiency" },
              { label: "Max Capacity", key: "maxCapacity" },
              { label: "Initial Capacity", key: "initialCapacity" },
              { label: "Max Charge/Discharge", key: "maxChargeDischarge" },
            ].map(({ label, key }) => (
              <div key={key} className="mb-2">
                <h5 className="text-xl font-bold">{label}</h5>
                <div>{battery[key as keyof IBatteryDTO] ?? "N/A"}</div>
              </div>
            ))
          ) : (
            <div>Bateria não encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
};
