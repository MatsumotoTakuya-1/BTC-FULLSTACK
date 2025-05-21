import axios from "axios";

export const fetchStockPrediction = async (symbol, range, model) => {
  const res = await axios.post("/api/predict", { symbol, range, model });
  console.log(res.data);

  return res.data;
};

export const fetchHistory = async () => {
  const res = await axios.get("/api/history");
  return res.data;
};

export const deleteHistory = async (id) => {
  await axios.delete(`/api/history/${id}`);
};

export const fetchApp = async () => {
  const res = await axios.get("/api/app");
  return res;
};
