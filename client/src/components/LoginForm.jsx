import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //フック。関数などイベント内で動的に遷移。

  const processingLogin = async () => {
    try {
      await axios.post("/api/auth/login", { username, password });
      navigate("/app"); //ログイン後appに遷移
    } catch (err) {
      alert("ログイン失敗");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          processingLogin();
        }}
      >
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">ログイン</button>
      </form>

      <p>
        <Link to="/register">ユーザ登録はこちら</Link>
      </p>
    </div>
  );
}

export default LoginForm;
