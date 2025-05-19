import { useState, useEffect } from "react";
import { fetchHistory, deleteHistory } from "../API/stockAPI";

function HistoryList(props) {
  const [history, setHistory] = useState([]);
  //   const [selectedId, setSelectedId] = useState(null);

  // 履歴データを取得
  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      console.error("履歴の取得に失敗しました", err);
    }
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
      <table>
        <thead>
          <tr>
            <th>銘柄</th>
            <th>検索日時</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
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
              <td>{new Date(item.created_at).toLocaleString("ja-JP")}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryList;
