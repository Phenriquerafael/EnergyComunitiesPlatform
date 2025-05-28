import simpleRestDataProvider from "@refinedev/simple-rest";
import { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:4000/api";
const API_URL_OptimizationModule = "http://localhost:8000";

const defaultProvider = simpleRestDataProvider(API_URL);
const optimizationProvider = simpleRestDataProvider(API_URL_OptimizationModule);

const selectProvider = (resource: string) => {
/*   if (resource.startsWith("optimizationModule")) {
    return optimizationProvider;
  } */
  return defaultProvider;
};

const customDataProvider: DataProvider = {
  getList: (params: any) =>
    selectProvider(params.resource).getList(params),

  getOne: (params: any) =>
    selectProvider(params.resource).getOne(params),

  getMany: (params: any) =>
    selectProvider(params.resource).getMany(params),

  create: (params: any) =>
    selectProvider(params.resource).create(params),

  update: (params: any) =>
    selectProvider(params.resource).update(params),

  deleteOne: (params: any) =>
    selectProvider(params.resource).deleteOne(params),

  getApiUrl: () => API_URL,
};

export const dataProviderInstance = customDataProvider;
