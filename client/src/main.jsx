import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Navigate, Routes } from "react-router";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const theme = createTheme({
  palette: {
    mode: "light", // or "dark"
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
  },
  shape: {
    borderRadius: 8,
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        {/* <Route path="/api/history" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
