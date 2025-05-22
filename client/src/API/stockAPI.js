import axios from "axios";

export const fetchStockPrediction = async (symbol, range, model) => {
  const res = await axios.post("/api/predict", { symbol, range, model });
  console.log(res.data);

  return res.data;
};

export const fetchHistory = async () => {
  const res = await axios.get("/api/history");
  return res;
};

export const fetchFavorites = async () => {
  const res = await axios.get("/api/history/favorite");
  return res;
};

//favoriteはブーリアン
export const updatedFavorite = async (id, favorite) => {
  const res = await axios.patch(`/api/history/favorite/${id}`, { favorite });
  // console.log("🚀 ~ updatedFavorite ~ res:", res);
  return res;
};

export const deleteHistory = async (id) => {
  await axios.delete(`/api/history/${id}`);
};

export const fetchApp = async () => {
  const res = await axios.get("/api/app");
  return res;
};
