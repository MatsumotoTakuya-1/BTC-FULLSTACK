import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //フック。関数などイベント内で動的に遷移。

  const processingRegister = async () => {
    try {
      await axios.post("/api/auth/register", { username, email, password });
      alert("登録に成功しました。ログインしてください。");
      navigate("/login");
    } catch (err) {
      alert("登録失敗");
      console.err(err);
    }
  };

  return (
    <div>
      <h2>ユーザ登録</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          processingRegister();
        }}
      >
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          placeholder="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          placeholder="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">登録</button>
      </form>
    </div>
  );
}

export default RegisterForm;
