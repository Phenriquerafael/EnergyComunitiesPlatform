

import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { Simulation } from "../Simulation/Simulation";
import { Prosumer } from "../Prosumer/Prosumer";
import { BoughtEnergy } from "./BoughtEnergy";
import { PhotovoltaicEnergyLoad } from "./PhotovoltaicEnergyLoad";
import { Load as Load } from "./ProfileLoad";
import { SoldEnergy } from "./SoldEnergy";
import { StateOfCharge } from "./StateOfCharge";
import { TimeStamp } from "./TimeStamp";

interface ProfileProps {
    prosumer: Prosumer;
    simulation: Simulation
    date: String;
    timestamp:TimeStamp;
    profileLoad: Load;
    stateOfCharge?: StateOfCharge;
    energyCharge?:Load;
    energyDischarge?:Load;
    photovoltaicEnergyLoad: PhotovoltaicEnergyLoad;
    boughtEnergy: BoughtEnergy;
    soldEnergy: SoldEnergy;
    peerOutputEnergyLoad: SoldEnergy; 
    peerInputEnergyLoad: BoughtEnergy;
}

export class Profile extends AggregateRoot<ProfileProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get prosumer(): Prosumer {
        return this.props.prosumer;
    }
    get simulation(): Simulation {
        return this.props.simulation;
    }
    get date(): String {
        return this.props.date;
    }

    get timestamp(): TimeStamp {
        return this.props.timestamp;
    }

    get profileLoad(): Load {
        return this.props.profileLoad;
    }

    get stateOfCharge(): StateOfCharge | undefined {
        return this.props.stateOfCharge;
    }

    get batteryCharge(): Load | undefined {
        return this.props.energyCharge;
    }

    get batteryDischarge(): Load | undefined {
        return this.props.energyDischarge;
    }

    get photovoltaicEnergyLoad(): PhotovoltaicEnergyLoad {
        return this.props.photovoltaicEnergyLoad;
    }
    get boughtEnergy(): BoughtEnergy {
        return this.props.boughtEnergy;
    }   
    get soldEnergy(): SoldEnergy {
        return this.props.soldEnergy;
    }

    get peerOutputEnergyLoad(): SoldEnergy {
        return this.props.peerOutputEnergyLoad;
    }

    get peerInputEnergyLoad(): BoughtEnergy {
        return this.props.peerInputEnergyLoad;
    }



    set timestamp(value: TimeStamp) {
        this.props.timestamp = value;
    }
    set profileLoad(value: Load) {
        this.props.profileLoad = value;
    }
    set stateOfCharge(value: StateOfCharge) {
        this.props.stateOfCharge = value;
    }
    set photovoltaicEnergyLoad(value: PhotovoltaicEnergyLoad) {
        this.props.photovoltaicEnergyLoad = value;
    }
    set boughtEnergy(value: BoughtEnergy) {
        this.props.boughtEnergy = value;
    }
    set soldEnergy(value: SoldEnergy) {
        this.props.soldEnergy = value;
    }

    set prosumer(value: Prosumer) {
        this.props.prosumer = value;
    }


    private constructor(props: ProfileProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ProfileProps, id?: UniqueEntityID): Result<Profile> {
        const guardedProps = [
            { argument: props.prosumer, argumentName: 'prosumer' },
            { argument: props.simulation, argumentName: 'simulation' },
            { argument: props.date, argumentName: 'date' },
           // { argument: props.energyCharge, argumentName: 'energyCharge' },
            //{ argument: props.energyDischarge, argumentName: 'energyDischarge' },
            { argument: props.peerOutputEnergyLoad, argumentName: 'peerOutputEnergyLoad' },
            { argument: props.peerInputEnergyLoad, argumentName: 'peerInputEnergyLoad' },
            { argument: props.timestamp, argumentName: 'timestamp' },
            { argument: props.profileLoad, argumentName: 'profileLoad' },
            //{ argument: props.stateOfCharge, argumentName: 'stateOfCharge' },
            { argument: props.photovoltaicEnergyLoad, argumentName: 'photovoltaicEnergyLoad' },
            { argument: props.boughtEnergy, argumentName: 'boughtEnergy' },
            { argument: props.soldEnergy, argumentName: 'soldEnergy' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Profile>(guardResult.message);
        }else {
            const profile = new Profile(props, id);
            return Result.ok<Profile>(profile);
        }
        
        
    }

    public toString(): string {
        return `Profile: { id: ${this._id.toString()},\n
        prosumer: ${this.props.prosumer.id.toString()},\n
        simulation: ${this.props.simulation.id.toString()},\n
        date: ${this.props.date.toString()},\n
        timestamp: ${this.props.timestamp.toString()},\n
        profileLoad: ${this.props.profileLoad.toString()},\n
        stateOfCharge: ${this.props.stateOfCharge?.toString()},\n
        energyCharge: ${this.props.energyCharge?.toString()},\n
        energyDischarge: ${this.props.energyDischarge?.toString()},\n
        peerOutputEnergyLoad: ${this.props.peerOutputEnergyLoad?.toString()},\n
        peerInputEnergyLoad: ${this.props.peerInputEnergyLoad?.toString()},\n
        photovoltaicEnergyLoad: ${this.props.photovoltaicEnergyLoad?.toString()},\n
        boughtEnergy: ${this.props.boughtEnergy?.toString()},\n
        soldEnergy: ${this.props.soldEnergy?.toString()} }\n`;
    }
}