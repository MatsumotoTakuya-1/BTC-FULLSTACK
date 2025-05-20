import { useState, useEffect } from "react";
import { fetchHistory, deleteHistory } from "../API/stockAPI";

function HistoryList(props) {
  const [history, setHistory] = useState([]);
  const [expandSymbols, setExpandSymbols] = useState({}); //{APPL :ture, TSLA: false}
  // 履歴データを取得
  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
      // console.log("🚀 ~ HistoryList ~ history:", await history);
    } catch (err) {
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
    console.log(expandSymbols);
    expandSymbols[symbol] = false;
    expandSymbols[symbol] = !expandSymbols[symbol];
    setExpandSymbols({ symbol: expandSymbols[symbol] });
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

  //   初回に履歴取得
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div>
      <h2>検索履歴</h2>
      {Object.entries(groupedHistory).map(([symbol, item]) => {
        return (
          <div key={symbol}>
            {/* トグルの設置 */}
            <div>
              <button onClick={toggleSymbol}>{symbol}</button>
            </div>
            {expandSymbols[symbol] && (
              <table>
                <thead>
                  <tr>
                    <th>銘柄</th>
                    <th>検索日時</th>
                    <th>表示期間</th>
                    <th>モデル</th>
                    <th>削除</th>
                  </tr>
                </thead>
                <tbody>
                  {item.map((item) => (
                    <tr key={item.id}>
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
