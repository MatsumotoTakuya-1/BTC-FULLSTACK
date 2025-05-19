import { useState, useEffect } from "react";
import { fetchHistory } from "../API/stockAPI";

function HistoryList(props) {
  const [history, setHistory] = useState();
  //   const [selectedId, setSelectedId] = useState(null);

  // 履歴データを取得
  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      console.log("🚀 ~ loadHistory ~ data:", data);
      setHistory(data);
    } catch (err) {
      console.error("履歴の取得に失敗しました", err);
    }
  };

  //   // ✅ 履歴を削除する処理
  //   const handleDelete = async (id) => {
  //     try {
  //       await deleteHistory(id);
  //       setHistory(history.filter((h) => h.id !== id));
  //     } catch (err) {
  //       console.error("削除エラー:", err);
  //       alert("削除に失敗しました");
  //     }
  //   };

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
          {history.map((item) => {
            <tr
              key={item.id}
              //   style={{
              //     backgroundColor:
              //       item.id === selectedId ? "#e0f0ff" : "transparent",
              //   }}
            >
              <td>{item.symbol}</td>
              <td>{1}</td>
              <td>
                <button>🗑</button>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryList;
