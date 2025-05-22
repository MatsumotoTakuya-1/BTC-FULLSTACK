import { useState, useEffect } from "react";
import { fetchHistory, deleteHistory, updatedFavorite } from "../API/stockAPI";
import { useNavigate } from "react-router";

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
      <h2 style={{ textAlign: "left" }}>検索履歴</h2>
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
                    <th>チェック</th>
                    <th>銘柄</th>
                    <th>検索日時</th>
                    <th>表示期間</th>
                    <th>モデル</th>
                    <th>お気に入り登録</th>
                    <th>削除</th>
                  </tr>
                </thead>
                <tbody>
                  {item.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => compareSelectedItem(item)}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            props.historySelect(item); // グラフへ反映
                          }}
                        >
                          {item.symbol}
                        </button>
                      </td>
                      <td>
                        {new Date(item.created_at).toLocaleString("ja-JP")}
                      </td>
                      <td>{item.range}</td>
                      <td>{item.model}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={favCheckedItem[item.id]}
                          onChange={(e) => {
                            // console.log(e.target.checked);
                            favoriteSelectedItem(item.id, e.target.checked);
                          }}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleDelete(item.id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default HistoryList;
