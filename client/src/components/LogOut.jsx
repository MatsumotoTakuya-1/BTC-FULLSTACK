import axios from "axios";
import { useNavigate } from "react-router";

function LogOut() {
  const navigate = useNavigate(); //フック。関数などイベント内で動的に遷移。
  const processingLogout = async () => {
    try {
      await axios.post("/api/auth/logout", { test: "test" });

      alert("ログアウトしました。");
      navigate("/"); //ログアウト後/に遷移
    } catch (err) {
      alert("ログアウト失敗");
      console.error(err);
    }
  };
  return (
    <div>
      <button onClick={processingLogout}>Logout</button>
    </div>
  );
}

export default LogOut;
