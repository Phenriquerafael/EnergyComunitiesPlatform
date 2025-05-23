
import axios from "axios";
import { OptimizeRequest, ProfileDTO } from "../interfaces";

const BASE_URL = "http://localhost:4000/api/profiles";
const Optimization_BASE_URL = "http://localhost:8000/optimize";

// Criação do perfil
export const createProfile = async (data: ProfileDTO) => {
  const response = await axios.post(`${BASE_URL}/`, data);
  return response.data;
};

// Criação a partir dos resultados da otimização
export const createFromOptimizationResults = async (data: OptimizeRequest) => {
  const response = await axios.post(`${BASE_URL}/optimize-results`, data);
  return response.data;
};

// Atualização do perfil
export const updateProfile = async (data: Partial<ProfileDTO>) => {
  const response = await axios.patch(`${BASE_URL}/`, data);
  return response.data;
};

// Obter perfil pelo ID
export const getProfileById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/id/${id}`);
  return response.data;
};

// Obter todos os perfis
export const getAllProfiles = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data;
};

// Obter perfis por usuário (prosumerId)
export const getProfilesByUser = async (prosumerId: string) => {
  const response = await axios.get(`${BASE_URL}/user/${prosumerId}`);
  return response.data;
};

// Deletar perfil
export const deleteProfile = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// Função para otimizar arquivo Excel
export const optimizeExcel = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(Optimization_BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Definir o cabeçalho apropriado para upload de arquivo
      },
    });
    return response.data; // Retorna os resultados da otimização
  } catch (error) {
    console.error("Erro ao otimizar o arquivo:", error);
    throw error; // Lança o erro para ser tratado onde for necessário
  }
};
