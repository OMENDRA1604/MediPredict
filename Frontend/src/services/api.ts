import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getSymptoms = () => API.get("/symptoms");

export const predictDisease = async (symptoms: string[]) => {
  const res = await API.post("/predict", { symptoms });
  return res.data;
};