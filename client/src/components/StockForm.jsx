import { useState } from "react";
import { fetchStockPrediction } from "../API/stockAPI";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";

function StockForm({ searchResult }) {
  const [symbol, setSymbol] = useState("");
  const [range, setRange] = useState("1w");
  const [model, setModel] = useState("model1");

  const symbolChange = (e) => setSymbol(e.target.value.toUpperCase());
  const rangeChange = (e) => setRange(e.target.value);
  const modelChange = (e) => setModel(e.target.value);

  const submitClick = async (e) => {
    e.preventDefault();
    if (!symbol) {
      alert("銘柄を入力してください");
      return;
    }
    try {
      const data = await fetchStockPrediction(symbol, range, model);
      searchResult(data);
    } catch (err) {
      alert("株価予測データの取得に失敗しました");
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={submitClick} display="flex" gap={2} flexWrap="wrap">
      <TextField
        label="ティッカー"
        placeholder="例: AAPL"
        value={symbol}
        onChange={symbolChange}
        required
      />
      <TextField
        select
        label="表示期間"
        value={range}
        onChange={rangeChange}
      >
        {["1w", "1m", "3m", "1y", "3y", "5y", "10y", "30y"].map((r) => (
          <MenuItem key={r} value={r}>
            {r}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="予測モデル"
        value={model}
        onChange={modelChange}
      >
        <MenuItem value="model1">モデル1（幾何ブラウン運動）</MenuItem>
        <MenuItem value="model2">モデル2（300回平均）</MenuItem>
        <MenuItem value="model3">モデル3（SVR）</MenuItem>
        <MenuItem value="model4">モデル4（XGBoost）</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" type="submit">
        検索
      </Button>
    </Box>
  );
}

export default StockForm;
