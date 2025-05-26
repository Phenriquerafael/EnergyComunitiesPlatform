export default interface IProsumerDTO {
    id?: string;
    batteryId: string;
    userId: string;
    communityId?: string;
}

export interface IProsumerDataDTO {
  id?: string;
  batteryId?: string;
  batteryName?: string;
  userId?: string;
  userName?: string;
  email?: string;
  communityId?: string;
  communityName?: string;
}