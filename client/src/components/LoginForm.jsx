import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
} from "@mui/material";

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
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ログイン
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            processingLogin();
          }}
        >
          <TextField
            label="ユーザー名"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="パスワード"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            ログイン
          </Button>
        </form>
        <Typography align="center">
          <MuiLink component={Link} to="/register">
            ユーザ登録はこちら
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginForm;
