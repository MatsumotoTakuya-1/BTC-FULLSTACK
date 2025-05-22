import { useState, useEffect } from "react";
import { fetchFavorites } from "../API/stockAPI";

function Favorite(props) {
  const [favorites, setFavorites] = useState([]);
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

  return (
    <div>
      <h2>お気に入りリスト</h2>
      {favorites.map((item) => {
        return <li key={item.id}>{item.symbol}</li>;
      })}
    </div>
  );
}

export default Favorite;
