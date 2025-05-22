import axios from "axios";
import { useState } from "react";

function TickerSeach() {
  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState([]);
  const [toggle, setToggle] = useState(false);

  const processingSeach = async () => {
    try {
      const res = await axios.post("/api/predict/ticker", { companyName });
      // console.log(res.data.seach);
      setTicker(
        res.data.seach.map((item) => ({
          shortname: item.shortname,
          symbol: item.symbol,
        }))
      );
      setCompanyName("");
    } catch (err) {
      alert("検索失敗");
      console.error(err);
    }
  };

  const toggleMenu = () => {
    setToggle(!toggle);
  };
  return (
    <div style={{ textAlign: "left" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          processingSeach();
        }}
      >
        <input
          placeholder="企業名"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        ></input>

        <button type="submit">ティッカー検索</button>
      </form>

      <button onClick={toggleMenu}>{toggle ? "🔼閉じる" : "🔽開く"}</button>
      {toggle && (
        <table>
          <thead>
            <tr>
              <th>企業名</th>
              <th>ティッカー</th>
            </tr>
          </thead>
          {ticker.map((item) => (
            <tr key={item.id}>
              <td>{item.shortname}</td>
              <td>{item.symbol}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}

export default TickerSeach;
