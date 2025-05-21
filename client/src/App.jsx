import "./App.css";
import StockForm from "./components/StockForm";
import StockChart from "./components/StockChart";
import HistoryList from "./components/HIstoryList";
import LogOut from "./components/LogOut";
import CompareChart from "./components/CompareChart";
import { useEffect, useState } from "react";
import { fetchApp } from "./API/stockAPI";
import { useNavigate } from "react-router";

function App() {
  const [stockData, setStockData] = useState(null);
  const [redrawData, setRedrawData] = useState(0); //検索時の再描画用
  const navigate = useNavigate(); //フック。関数などイベント内で動的に遷移。
  const [showCompare, setShowCompare] = useState(false); //比較機能のON/OFF
  const [selectedStock, setSelectedStock] = useState([]);
  // console.log("🚀 ~ App ~ selectedStock:", selectedStock);

  const searchResult = (data) => {
    setStockData(data);
    setRedrawData((prev) => prev + 1); //検索のたび更新
    console.log(redrawData);
  };

  //履歴のアイテムが押された時の処理
  const historySelect = (data) => {
    setStockData(data);
  };

  const compareToggle = () => {
    setShowCompare(!showCompare);
  };

  //認証用
  // Appに入る
  const loadApp = async () => {
    try {
      const res = await fetchApp();
      // console.log("🚀 ~ loadApp ~ res:", res.status);
      console.log("認証に成功しました");
    } catch (err) {
      //セッションID無ければ401を返し,catchに入る
      if (err.response.status === 401) {
        alert("セッションIDがありません");
        navigate("/");
      } else {
        console.error("予期しないえらーが発生しました", err);
      }
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

      {/* 検索フォーム */}
      <StockForm searchResult={searchResult} />

      <button onClick={compareToggle} style={{ alignItems: "left" }}>
        {showCompare ? "比較チャートを閉じる" : "比較チャートモード"}
      </button>

      <hr style={{ borderTop: "1px solid #ccc" }} />

      {stockData && !showCompare && <StockChart data={stockData} />}
      {showCompare && <CompareChart selectedStock={selectedStock} />}

      <hr style={{ borderTop: "1px solid #ccc" }} />

      <HistoryList
        historySelect={historySelect}
        key={redrawData}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
      />
      {/* /keyで渡すとkeyの値が変わるとReactコンポーネントが再描画される */}
    </div>
  );
}

export default App;
