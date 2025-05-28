import axios from "axios";
import {IBatteryDTO} from "../interfaces";

const BASE_URL = "http://localhost:4000/api/batteries";
const Optimization_BASE_URL = "http://localhost:8000/optimizationModule";

export const createBattery = async (data: IBatteryDTO) => {
    const response = await axios.post(`${BASE_URL}/create`, data);
    return response.data;
    }

export const updateBattery = async (data: IBatteryDTO) => {
    const response = await axios.patch(`${BASE_URL}/${data.id}`, data);
    return response.data;
}

export const createBatteries = async (data: IBatteryDTO[]) => {
    const response = await axios.post(`${BASE_URL}/batteryList`, { batteryList: data });
    return response.data;
}

export const deleteBattery = async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAllBatteries = async () => {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
}

export const getBatteryById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/id/${id}`);
    return response.data;
}

export const createBatteriesFromExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(`${Optimization_BASE_URL}/batteryList`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error optimizing Excel file:", error);
        throw error;
    }
}

