import { useState } from "react";
import { fetchStockPrediction } from "../API/stockAPI";

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
    <form
      onSubmit={submitClick}
      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
    >
      {/* 銘柄入力 */}
      <label>
        <span style={{ marginRight: "0.5rem" }}>ティッカー :</span>
        <input
          type="text"
          placeholder="例:AAPL"
          value={symbol}
          onChange={symbolChange}
        />
      </label>

      {/* 表示期間選択 */}
      <label>
        <span style={{ marginRight: "0.5rem" }}>表示/予測期間 :</span>
        <select value={range} onChange={rangeChange}>
          <option value="1w">1週間</option>
          <option value="1m">1か月</option>
          <option value="1y">1年</option>
          <option value="3y">3年</option>
        </select>
      </label>

      {/* モデル選択 */}
      <label>
        <span style={{ marginRight: "0.5rem" }}>予測モデル :</span>
        <select value={model} onChange={modelChange}>
          <option value="model1">モデル1（幾何ブラウン運動）</option>
          <option value="model2">モデル2（ML: SVR）</option>
          <option value="model3">モデル3（ML: XGBoost）</option>
        </select>
      </label>

      {/* 送信ボタン */}
      <button type="submit">検索</button>
    </form>
  );
}

export default StockForm;
