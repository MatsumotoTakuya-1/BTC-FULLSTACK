import "./App.css";
import StockForm from "./components/StockForm";
import StockChart from "./components/StockChart";
import { useEffect, useState } from "react";

function App() {
  const [stockData, setStockData] = useState(null);

  const searchResult = (data) => {
    setStockData(data);
  };
  return (
    <div className="">
      <h1>株価予測アプリ</h1>

      <StockForm searchResult={searchResult} />
      {stockData && <StockChart data={stockData} />}
    </div>
  );
}

export default App;
