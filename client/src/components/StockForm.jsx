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

function StockForm(props) {
  // 銘柄・期間・モデルのステート
  const [symbol, setSymbol] = useState("");
  const [range, setRange] = useState("1w");
  const [model, setModel] = useState("model1");

  // 銘柄入力時の処理（英大文字で自動変換）
  const symbolChange = (e) => {
    setSymbol(e.target.value.toUpperCase());
  };

  // 期間変更時の処理
  const rangeChange = (e) => {
    setRange(e.target.value);
  };

  // モデル変更時の処理
  const modelChange = (e) => {
    setModel(e.target.value);
  };

  const submitClick = async (e) => {
    e.preventDefault(); //フォーム送信後のページリロード止める。
    if (!symbol) {
      alert("銘柄を入力してください");
      return;
    }
    try {
      const data = await fetchStockPrediction(symbol, range, model);
      console.log(data);

      props.searchResult(data);
    } catch (err) {
      console.error("API取得失敗:", err);
      alert("株価予測データの取得に失敗しました");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submitClick}
      display="flex"
      gap={5}
      // justifyContent="space-between"
      flexWrap="wrap"
    >
      {/* 銘柄入力 */}
      <TextField
        label="ティッカー"
        placeholder="例: AAPL"
        value={symbol}
        onChange={symbolChange}
        required
      />

      {/* 表示期間選択 */}
      <TextField select label="表示期間" value={range} onChange={rangeChange}>
        <MenuItem value="1w">1週間</MenuItem>
        <MenuItem value="1m">1か月</MenuItem>
        <MenuItem value="3m">3か月</MenuItem>
        <MenuItem value="1y">1年</MenuItem>
        <MenuItem value="3y">3年</MenuItem>
        <MenuItem value="5y">5年</MenuItem>
        <MenuItem value="10y">10年</MenuItem>
        <MenuItem value="30y">30年</MenuItem>
      </TextField>

      {/* モデル選択 */}
      <TextField select label="予測モデル" value={model} onChange={modelChange}>
        <MenuItem value="model1">モデル1（幾何ブラウン運動）</MenuItem>
        <MenuItem value="model2">モデル2（300回平均）</MenuItem>
        <MenuItem value="model3">モデル3（SVR）</MenuItem>
        <MenuItem value="model4">モデル4（XGBoost）</MenuItem>
      </TextField>

      {/* 送信ボタン */}
      <Button variant="contained" color="primary" type="submit" size="large">
        検索
      </Button>
    </Box>
  );
}

export default StockForm;
