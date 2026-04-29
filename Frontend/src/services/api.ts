import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export const getSymptoms = () => API.get("/symptoms");

export const predictDisease = async (symptoms: string[]) => {
  const res = await API.post("/predict", { symptoms });
  return res.data;
};