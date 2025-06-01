export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  status: IOrderStatus;
  adress: IAddress;
  amount: number;
}

export interface IUser {
  id: number;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  addresses: IAddress[];
}

export interface IOrderStatus {
  id: number;
  text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
}

export interface IAddress {
  text: string;
  coordinate: [string, string];
}

export interface IChartDatum {
  date: string;
  value: string;
}

export interface IChart {
  data: IChartDatum[];
  total: number;
  trend: number;
}

export interface IProduct {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  createdAt: string;
  price: number;
  category: ICategory;
  stock: number;
}

export interface ICategory {
  id: number;
  title: string;
  isActive: boolean;
}

export type TTab = {
  id: number;
  label: string;
  content: JSX.Element;
};

export interface ProfileDTO {
    id?: string;
    prosumerId: string;
    date: string;
    intervalOfTime: string;
    numberOfIntervals: number;
    stateOfCharge: string;
    energyCharge: string;
    energyDischarge: string;
    photovoltaicEnergyLoad: string;
    boughtEnergyAmount: string;
    boughtEnergyPrice?: string;
    soldEnergyAmount: string;
    soldEnergyPrice?: string;
    peerOutputEnergyLoad: string;
    peerOutPrice?: string;
    peerInputEnergyLoad: string;
    peerInPrice?: string;
    profileLoad: string;
  }

  export interface OptimizationResult {
    Day: string;
    Time_Step: number;
    Prosumer: string;
    P_buy: string;
    P_sell: string;
    SOC: string;
    P_ESS_ch: string;
    P_ESS_dch: string;
    P_PV_load: string;
    P_Peer_out: string;
    P_Peer_in: string;
    P_Load: string;
  }
  
  export interface OptimizeRequest {
    total_objective_value?: string;
    detailed_results: OptimizationResult[];
  }

export interface IRoleDTO {
  id?: string;
  name?: string;
}


  export interface IBatteryDTO {
  id?: string;
    name?: string;
    description?: string;
    efficiency?: string;
    maxCapacity?: string;
    initialCapacity?: string;
    maxChargeDischarge?: string;

}

export interface IUserDTO {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  isActive?: boolean;
}

export interface ICommunityDTO {
    id?: string;
      name?: string;
      description?: string;
  }

export interface IProsumerDTO {
    id?: string;
    batteryId: IBatteryDTO;
    userId: IUserDTO;
    communityId?: ICommunityDTO;
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

export interface ICommunityManagerDTO {
  id?: string;
  userId?: string;
  communityId?: string;
}

    
