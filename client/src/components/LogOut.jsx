import axios from "axios";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";

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
    <Button
      onClick={processingLogout}
      variant="outlined" //contained にすると塗りつぶし
      color="secondary" //color="secondary" で警告・ログアウトっぽい印象に
      size="small" //size="small" で控えめサイズ（medium や large も選べる）
    >
      Logout
    </Button>
  );
}

export default LogOut;
