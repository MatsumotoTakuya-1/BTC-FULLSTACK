const express = require("express");
const cors = require("cors");
const path = require("path");
const predictRouter = require("./routers/predictRouter");
const historyRouter = require("./routers/historyRouter");
const authRouter = require("./routers/authRouter");
const cookieParser = require("cookie-parser"); //サーバー側でクッキーを扱うミドルウェア?

const app = express();

app.use(cors());
app.use(express.json());

// express でcookieを取得
app.use(cookieParser());

// form からのリクエストを受けるために必要
// app.use(express.urlencoded({ extended: true }));

// dist 配信-----
app.use(express.static(path.join(__dirname, "./public")));
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// -------------

app.get("/api/app", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    res.status(200).json({ message: "認証に成功しました" });
  } else {
    res.status(401).json({ error: "認証に失敗しました" });
  }
});

app.use("/api/predict", predictRouter);
app.use("/api/history", historyRouter);
app.use("/api/auth", authRouter);

module.exports = app;
