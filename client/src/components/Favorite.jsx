import { useState, useEffect } from "react";
import { fetchFavorites, updatedFavorite } from "../API/stockAPI";
import FavoriteChart from "./FavoriteChart";

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
      <h2 style={{ textAlign: "left" }}>お気に入りリスト</h2>
      <div style={{ textAlign: "left" }}>
        <strong>ポートフォリオ全体↓</strong>
        <p>
          年次平均リターン：{(averageReturn * 100).toFixed(2)}%,
          リスク(年次標準偏差)：
          {(averageResk * 100).toFixed(2)}%
        </p>
      </div>
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
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  // marginBottom: "1rem",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr>
                    <th>銘柄</th>
                    <th>検索日時</th>
                    <th>表示期間</th>
                    <th>モデル</th>
                  </tr>
                </thead>
                <tbody>
                  {item.map((item) => (
                    <tr key={item.id}>
                      <td>{item.symbol}</td>
                      <td>
                        {new Date(item.created_at).toLocaleString("ja-JP")}
                      </td>
                      <td>{item.range}</td>
                      <td>{item.model}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
