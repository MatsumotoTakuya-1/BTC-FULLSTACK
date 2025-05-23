import { useState, useEffect } from "react";
import { fetchHistory, deleteHistory, updatedFavorite } from "../API/stockAPI";
import { useNavigate } from "react-router";
import { Typography, Box, IconButton, Checkbox, Button } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function HistoryList(props) {
  const [history, setHistory] = useState([]);
  const [expandSymbols, setExpandSymbols] = useState({}); //{APPL :ture, TSLA: false}
  const [favCheckedItem, setFavCheckedItem] = useState({});
  const navigate = useNavigate();

  // 履歴データを取得
  const loadHistory = async () => {
    try {
      const res = await fetchHistory();
      setHistory(res.data);

      //お気に入りのチェック状態を保持
      const initialCheck = {};
      res.data.forEach((item) => {
        const saved = localStorage.getItem(item.id);
        initialCheck[item.id] = saved === "true";
      });
      setFavCheckedItem(initialCheck);
    } catch (err) {
      if (err.response.status === 401) {
        alert("セッションIDがありません");
        navigate("/");
      }
      console.error("履歴の取得に失敗しました", err);
    }
  };

  //history = [{id,actual,..,range,model,symbol,created_at},{},...]
  //groupedHistory = {APPL:[item1,item2]} itemはhistoryの１要素

  const groupedHistory = history.reduce((acc, item) => {
    if (!acc[item.symbol]) {
      acc[item.symbol] = [];
    }
    acc[item.symbol].push(item);
    return acc;
  }, {});
  // console.log("🚀 ~ groupedHistory ~ groupedHistory:", groupedHistory);
  // console.log(
  //   "🚀 ~ {Object.entries ~ Object.entries(groupedHistory):",
  //   Object.entries(groupedHistory)
  // );

  const toggleSymbol = (symbol) => {
    // console.log(expandSymbols[symbol]);
    const current = expandSymbols[symbol] || false;
    const update = { ...expandSymbols };
    update[symbol] = !current;
    setExpandSymbols(update);
  };

  //  履歴を削除する処理
  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      setHistory(history.filter((h) => h.id !== id));
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました");
    }
  };

  const compareSelectedItem = (item) => {
    //selectedStockは現在選択されている履歴の配列.itemはユーザーがクリックした履歴のアイテム
    const exist = props.selectedStock.some((stock) => stock.id === item.id);
    let updated;
    if (exist) {
      updated = props.selectedStock.filter((stock) => stock.id !== item.id); //もしあれば、履歴削除→チェックボックス外す側
    } else {
      updated = [...props.selectedStock, item]; //無ければ配列に追加→チェックボックスつける側
    }
    props.setSelectedStock(updated);
  };

  const favoriteSelectedItem = async (id, checked) => {
    const update = await updatedFavorite(id, checked);
    props.setFavkey((prev) => prev + 1);
    setFavCheckedItem({
      ...favCheckedItem,
      [id]: checked,
    });
    localStorage.setItem(id, checked);

    // setHistory((prev) =>
    //   prev.map((item) =>
    //     item.id === id ? { ...item, favorite: checked } : item
    //   )
    // );
  };

  //   初回に履歴取得
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div>
      <Typography variant="h5">検索履歴</Typography>
      {Object.entries(groupedHistory).map(([symbol, item]) => {
        return (
          <div key={symbol}>
            {/* トグルの設置 */}
            <div
              onClick={() => toggleSymbol(symbol)}
              style={{
                cursor: "pointer",
                // background: "#f0f0f0",
                padding: "0.7rem",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              📁 {symbol}: {"  "}
              {item[0].company.name}
            </div>
            {expandSymbols[symbol] && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="light">チェック</TableCell>
                      <TableCell align="light">銘柄</TableCell>
                      <TableCell align="light">検索日時</TableCell>
                      <TableCell align="light">表示期間</TableCell>
                      <TableCell align="light">モデル</TableCell>
                      <TableCell align="light">お気に入り登録</TableCell>
                      <TableCell align="light">削除</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="light">
                          <input
                            type="checkbox"
                            onChange={() => compareSelectedItem(item)}
                          />
                        </TableCell>
                        <TableCell align="light">
                          <Button
                            onClick={() => {
                              props.historySelect(item); // グラフへ反映
                            }}
                            variant="text"
                            color="primary"
                          >
                            {item.symbol}
                          </Button>
                        </TableCell>
                        <TableCell align="light">
                          {new Date(item.created_at).toLocaleString("ja-JP")}
                        </TableCell>
                        <TableCell align="light">{item.range}</TableCell>
                        <TableCell align="light">{item.model}</TableCell>
                        <TableCell align="light">
                          <input
                            type="checkbox"
                            checked={favCheckedItem[item.id]}
                            onChange={(e) => {
                              // console.log(e.target.checked);
                              favoriteSelectedItem(item.id, e.target.checked);
                            }}
                          />
                        </TableCell>
                        <TableCell align="light">
                          <Button
                            onClick={() => handleDelete(item.id)}
                            color="primary"
                            variant="text"
                          >
                            🗑
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default HistoryList;
