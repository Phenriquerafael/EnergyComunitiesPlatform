import axios from "axios";

const API_URL = "http://localhost:4000/api/roles"; // Ajuste se a base for diferente

export interface Role {
  id?: string;
  name: string;
}

export const roleService = {
  /**
   * Cria uma nova role
   */
  create: async (role: Role) => {
    const response = await axios.post(`${API_URL}/`, role);
    return response.data;
  },

  /**
   * Atualiza uma role existente
   */
  update: async (role: Role) => {
    const response = await axios.put(`${API_URL}/`, role);
    return response.data;
  },

  /**
   * Obtém uma role por ID
   */
  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/id/${id}`);
    return response.data;
  },

  /**
   * Obtém uma role por nome
   */
  getByName: async (name: string) => {
    const response = await axios.get(`${API_URL}/name/${name}`);
    return response.data;
  },

  /**
   * Retorna todas as roles
   */
  getAll: async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  }
};
