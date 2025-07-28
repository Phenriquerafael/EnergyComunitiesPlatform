import { InformationCircleIcon, ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { FunctionComponent, useState } from "react";

interface InfoModalProps {}

const InfoModal: FunctionComponent<InfoModalProps> = () => {
    const openModal = () => {
        const modal = document.getElementById('my_modal_5') as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    };

    const [activeTab, setActiveTab] = useState("PL");

    const tabClass = (tab: string) =>
        `tab tab-lifted ${activeTab === tab ? "tab-active" : ""}`;

    return (
        <>
            <div className="tooltip tooltip-right" data-tip="Input file description">
                <InformationCircleIcon
                    className="h-5 w-5 shrink-0 cursor-pointer text-blue-500"
                    onClick={openModal}
                />
            </div>

            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-5xl">
                    <h3 className="font-bold text-lg mb-4">Optimization algorithm input description</h3>

                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-lifted">
                        {["PL", "Buy/Sell", "PPV Capacity", "ESS-Param"].map((tab) => (
                            <a
                                key={tab}
                                role="tab"
                                className={tabClass(tab)}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </a>
                        ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="mt-4">
                        {activeTab === "PL" && (
                            <div role="tabpanel" className="p-4 bg-base-100 border border-base-300 rounded-box overflow-x-auto">
                                <p className="mb-4 text-sm text-gray-600">
                                    Includes all the energy consumption data for each participant.
                                </p>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>DATE</th><th>TIME</th><th className="tooltip" data-tip="kWh">PL1</th><th>...</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>01.01.2024</td><td>00:00:00</td><td>-</td><td>...</td></tr>
                                        <tr><td>01.01.2024</td><td>00:15:00</td><td>-</td><td>...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Buy/Sell" && (
                            <div role="tabpanel" className="p-4 bg-base-100 border border-base-300 rounded-box overflow-x-auto">
                                <p className="mb-4 text-sm text-gray-600">
                                    Includes the price of electricity for Buying and selling.
                                    <br />
                                    (in what currency?)
                                </p>
                                <table className="table table-sm">
                                    <thead>
                                        <tr><th>DATE</th><th>TIME</th><th>Cbuy</th><th>Csell</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>01.01.2024</td><td>00:00:00</td><td>-</td><td>-</td></tr>
                                        <tr><td>01.01.2024</td><td>00:15:00</td><td>-</td><td>-</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "PPV Capacity" && (
                            <div role="tabpanel" className="p-4 bg-base-100 border border-base-300 rounded-box overflow-x-auto">
                                <p className="mb-4 text-sm text-gray-600">
                                    Includes all the energy production data for each participant.
                                </p>
                                <table className="table table-sm">
                                    <thead>
                                        <tr><th>DATE</th><th>TIME</th><th className="tooltip" data-tip="kWh">PV1</th><th>...</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>01.01.2024</td><td>00:00:00</td><td>-</td><td>-</td></tr>
                                        <tr><td>01.01.2024</td><td>00:15:00</td><td>-</td><td>-</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "ESS-Param" && (
                            <div role="tabpanel" className="p-4 bg-base-100 border border-base-300 rounded-box overflow-x-auto">
                                <p className="mb-4 text-sm text-gray-600">
                                    Characteristics of the battery associated to prosumers individually.
                                </p>
                                <table className="table table-sm">
                                    <thead>
                                        <tr><th></th><th>ESS1</th><th>...</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="tooltip" data-tip="Efficiency ratio">Eta</td><td>-</td><td>-</td></tr>
                                        <tr><td className="tooltip" data-tip="Discharge rate">Dprate</td><td>-</td><td>-</td></tr>
                                        <tr><td className="tooltip" data-tip="Total battery capacity (kWh)">Cap</td><td>-</td><td>-</td></tr>
                                        <tr><td className="tooltip" data-tip="Initial capacity (kWh)">Capinitial</td><td>-</td><td>-</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Download Section */}
                    <div className="mt-8 border-t pt-4">
                        <h4 className="font-semibold mb-2">Sample Files</h4>
                        <ul className="flex flex-row justify-start items-center gap-4">
                            <li>
                                <a
                                    href="/fileSamples/V3/EmptySample_01-01-2024_01-03-2024.xlsx"
                                    download
                                    className="btn btn-sm btn-outline flex items-center gap-2"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    Empty
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/fileSamples/V3/SmallSample_01-01-2024_01-03-2024.xlsx"
                                    download
                                    className="btn btn-sm btn-outline flex items-center gap-2 tooltip tooltip-bottom"
                                    data-tip="01/01/2024 - 01/03/2024"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    Small
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/fileSamples/V3/BigSample_01-01-2024_18-11-2024.xlsx"
                                    download
                                    className="btn btn-sm btn-outline flex items-center gap-2 tooltip tooltip-bottom"
                                    data-tip="01/01/2024 - 18/11/2024"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    Big
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default InfoModal;
