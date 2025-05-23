import "./App.css";
import StockForm from "./components/StockForm";
import StockChart from "./components/StockChart";
import HistoryList from "./components/HIstoryList";
import LogOut from "./components/LogOut";
import CompareChart from "./components/CompareChart";
import { useEffect, useState } from "react";
import { fetchApp } from "./API/stockAPI";
import { useNavigate } from "react-router";
import Favorite from "./components/Favorite";
import TickerSeach from "./components/TickerSeach";
import {
  Container,
  Box,
  Typography,
  Button,
  Divider,
  Paper,
} from "@mui/material";

function App() {
  const [stockData, setStockData] = useState(null);
  const [redrawData, setRedrawData] = useState(0); //検索時の再描画用
  const navigate = useNavigate(); //フック。関数などイベント内で動的に遷移。
  const [showCompare, setShowCompare] = useState(false); //比較機能のON/OFF
  const [selectedStock, setSelectedStock] = useState([]); //比較機能のチェックボックス用
  const [username, setUsername] = useState("");
  const [favkey, setFavkey] = useState(0); //お気に入り機能のチェックボックス用
  // console.log("🚀 ~ App ~ favkey:", favkey);
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
      // console.log("🚀 ~ loadApp ~ res:", res);
      setUsername(res.data.username); //stateで管理しないと再度レンダリングしてくれない
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

    const interval = setInterval(() => {
      loadApp();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* ヘッダー */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h3">株価予測アプリ</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">
            Login user: <br />
            {username}
          </Typography>
          <LogOut />
        </Box>
      </Box>

      {/* 検索フォーム */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <StockForm searchResult={searchResult} />

        <Button
          onClick={compareToggle}
          variant="text"
          color="primary"
          sx={{ mt: 2 }}
        >
          {showCompare ? "比較チャートを閉じる" : "比較チャートモード"}
        </Button>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* チャート */}
      {stockData && !showCompare && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <StockChart data={stockData} />
        </Paper>
      )}
      {showCompare && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <CompareChart selectedStock={selectedStock} />
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      {/* 履歴 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <HistoryList
          historySelect={historySelect}
          key={redrawData}
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          setFavkey={setFavkey}
        />
        {/* /keyで渡すとkeyの値が変わるとReactコンポーネントが再描画される */}
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* お気に入り */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Favorite favkey={favkey} />
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* ティッカー検索 */}
      <Paper sx={{ p: 2 }}>
        <TickerSeach />
      </Paper>
    </Container>
  );
}

export default App;
