import { useState, useEffect } from "react";
import { fetchFavorites, updatedFavorite } from "../API/stockAPI";
import FavoriteChart from "./FavoriteChart";
import { Typography, Box, IconButton, Checkbox } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function Favorite(props) {
  const [favorites, setFavorites] = useState([]);
  const [expandSymbols, setExpandSymbols] = useState({}); //{APPL :ture, TSLA: false}

  // 履歴データを取得
  const loadFavorites = async () => {
    try {
      const res = await fetchFavorites();

      setFavorites(res.data);
    } catch (err) {
      if (err.response.status === 401) {
        alert("セッションIDがありません");
        navigate("/");
      }
      console.error("履歴の取得に失敗しました", err);
    }
  };

  //   初回に履歴取得
  useEffect(() => {
    loadFavorites();
  }, [props.favkey]);

  const toggleSymbol = (symbol) => {
    // console.log(expandSymbols[symbol]);
    const current = expandSymbols[symbol] || false;
    const update = { ...expandSymbols };
    update[symbol] = !current;
    setExpandSymbols(update);
  };

  const groupedFavorite = favorites.reduce((acc, item) => {
    if (!acc[item.symbol]) {
      acc[item.symbol] = [];
    }
    acc[item.symbol].push(item);
    return acc;
  }, {});

  // console.log("🚀 ~ groupedFavorite ~ groupedFavorite:", groupedFavorite);
  //ポートフォリオ全体のリターンとリスクを計算ーーーーーーーーーーーーー
  const totalReturn = favorites.reduce(
    (acc, item) => acc + Number(item.annualReturn),
    0
  );
  const totalResk = favorites.reduce(
    (acc, item) => acc + Number(item.annualResk),
    0
  );
  const averageReturn =
    favorites.length > 0 ? totalReturn / favorites.length : 0;
  const averageResk = favorites.length > 0 ? totalResk / favorites.length : 0;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        お気に入りリスト
      </Typography>
      <Box>
        <Typography variant="body2" align="center">
          <strong>ポートフォリオ全体:</strong>
        </Typography>

        <Typography variant="body2" align="center">
          年次平均リターン：{(averageReturn * 100).toFixed(2)}%, リスク：
          {(averageResk * 100).toFixed(2)}%
        </Typography>
      </Box>
      {Object.entries(groupedFavorite).map(([symbol, item]) => {
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
                      <TableCell align="light">銘柄</TableCell>
                      <TableCell align="light">検索日時</TableCell>
                      <TableCell align="light">表示期間</TableCell>
                      <TableCell align="light">モデル</TableCell>
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
                        <TableCell align="light">{item.symbol}</TableCell>
                        <TableCell align="light">
                          {new Date(item.created_at).toLocaleString("ja-JP")}
                        </TableCell>
                        <TableCell align="light">{item.range}</TableCell>
                        <TableCell align="light">{item.model}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        );
      })}

      <hr style={{ borderTop: "1px solid #ccc" }} />

      <FavoriteChart favorites={favorites} />
    </div>
  );
}

export default Favorite;
