import "./App.css";
import StockForm from "./components/StockForm";
import StockChart from "./components/StockChart";
import HistoryList from "./components/HIstoryList";
import LogOut from "./components/LogOut";
import { useEffect, useState } from "react";
import { fetchApp } from "./API/stockAPI";
import { useNavigate } from "react-router";

function App() {
  const [stockData, setStockData] = useState(null);
  const [redrawData, setRedrawData] = useState(0); //検索時の再描画用
  const navigate = useNavigate(); //フック。関数などイベント内で動的に遷移。

  const searchResult = (data) => {
    setStockData(data);
    setRedrawData((prev) => prev + 1); //検索のたび更新
    console.log(redrawData);
  };

  //履歴のアイテムが押された時の処理
  const historySelect = (data) => {
    setStockData(data);
  };

  //認証用
  // Appに入る
  const loadApp = async () => {
    try {
      const res = await fetchApp();
      // console.log("🚀 ~ loadApp ~ res:", res.status);
      if (res.status !== 200) {
        alert("セッションIDがありません");
        navigate("/");
      }
    } catch (err) {
      console.error("履歴の取得に失敗しました", err);
    }
  };

  useEffect(() => {
    loadApp();
  });

  return (
    <div className="">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>株価予測アプリ</h1>
        <LogOut />
      </div>

      <StockForm searchResult={searchResult} />

      <hr style={{ borderTop: "1px solid #ccc" }} />
      {stockData && <StockChart data={stockData} />}

      <hr style={{ borderTop: "1px solid #ccc" }} />

      <HistoryList historySelect={historySelect} key={redrawData} />
      {/* /keyで渡すとkeyの値が変わるとReactコンポーネントが再描画される */}
    </div>
  );
}

export default App;
