export default interface IProsumerRepo {
  save(prosumer: any): Promise<any>;
    findById(id: string): Promise<any>;
    findAll(): Promise<any[]>;
    findByUserId(userId: string): Promise<any>;
    findByBatteryId(batteryId: string): Promise<any>;
}