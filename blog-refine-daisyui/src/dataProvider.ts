import simpleRestDataProvider from "@refinedev/simple-rest";
import { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:4000/api";
const API_URL_OptimizationModule = "http://localhost:8000";

const defaultProvider = simpleRestDataProvider(API_URL);
const optimizationProvider = simpleRestDataProvider(API_URL_OptimizationModule);

const selectProvider = (resource: string) => {
  if (resource.startsWith("optimizationModule")) {
    return optimizationProvider;
  }
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

  custom: async ({ url, method, payload, headers, meta }) => {
    const baseUrl = meta?.baseUrl || API_URL; // Fallback to default API_URL if meta.baseUrl is not provided
    const requestUrl = `${baseUrl}/${url}`;

    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (method.toUpperCase() !== "GET" && payload) {
      options.body = JSON.stringify(payload);
    }

    try {
      const response = await fetch(requestUrl, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to perform custom request: ${error.message}`);
      } else {
        throw new Error("Failed to perform custom request: Unknown error");
      }
    }
  },
};

export const dataProviderInstance = customDataProvider;