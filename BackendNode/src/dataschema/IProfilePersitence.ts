import { BoughtEnergy } from "../domain/Prosumer/Profile/BoughtEnergy";
import { PhotovoltaicEnergyLoad } from "../domain/Prosumer/Profile/PhotovoltaicEnergyLoad";
import { ProfileLoad } from "../domain/Prosumer/Profile/ProfileLoad";
import { SoldEnergy } from "../domain/Prosumer/Profile/SoldEnergy";
import { StateOfCharge } from "../domain/Prosumer/Profile/StateOfCharge";
import { TimeStamp } from "../domain/Prosumer/Profile/TimeStamp";
import { Prosumer } from "../domain/Prosumer/Prosumer";


export default interface IProfilePersistence {
  id: string;
    prosumer: Prosumer;
    timestamp: TimeStamp;
    stateOfCharge: StateOfCharge;
    photovoltaicEnergyLoad: PhotovoltaicEnergyLoad;
    boughtEnergy: BoughtEnergy
    soldEnergy: SoldEnergy;
    profileLoad: ProfileLoad; 
}