import "./App.css";
import StockForm from "./components/StockForm";
import StockChart from "./components/StockChart";
import HistoryList from "./components/HIstoryList";
import LogOut from "./components/LogOut";
import { useEffect, useState } from "react";

function App() {
  const [stockData, setStockData] = useState(null);

  const searchResult = (data) => {
    setStockData(data);
  };

  //履歴のアイテムが押された時の処理
  const historySelect = (data) => {
    setStockData(data);
  };
  return (
    <div className="">
      <LogOut />
      <h1>株価予測アプリ</h1>

      <StockForm searchResult={searchResult} />
      {stockData && <StockChart data={stockData} />}
      <HistoryList historySelect={historySelect} />
    </div>
  );
}

export default App;
