import simpleRestDataProvider from "@refinedev/simple-rest";
import { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:4000/api";

const customDataProvider: DataProvider = {
  ...simpleRestDataProvider(API_URL),

  update: async ({ resource, variables }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "PATCH", // ou PATCH se o teu backend aceitar
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`, // se for necessário
      },
      body: JSON.stringify(variables),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Erro ao atualizar ${resource}: ${response.status} - ${JSON.stringify(error)}`
      );
    }

    const data = await response.json();

    return { data };
  },
};

export const dataProviderInstance = customDataProvider;
