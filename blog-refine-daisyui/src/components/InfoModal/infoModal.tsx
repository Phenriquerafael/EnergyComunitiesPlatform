import { FunctionComponent } from "react";

interface InfoModalProps {}

const InfoModal: FunctionComponent<InfoModalProps> = () => {
    const openModal = () => {
        const modal = document.getElementById('my_modal_5') as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    };

    return (
        <>
            <div className="tooltip tooltip-right tooltip-neutral" data-tip="More information">
                <svg  onClick={openModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-5 w-5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            </div>


            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Table</h3>
                        {/* name of each tab group should be unique */}
                        <div className="tabs tabs-lift">
                        <input type="radio" name="my_tabs_3" className="tab" aria-label="Tab 1" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 1</div>

                        <input type="radio" name="my_tabs_3" className="tab" aria-label="Tab 2" defaultChecked />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 2</div>

                        <input type="radio" name="my_tabs_3" className="tab" aria-label="Tab 3" />
                        <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
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
