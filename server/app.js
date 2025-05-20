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

// dist 配信
app.use(express.static(path.join(__dirname, "./public")));
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/app", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.redirect("/");
  }
});
app.get("/api/history", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.redirect("/");
  }
});

app.use("/api", predictRouter);
app.use("/api", historyRouter);

app.use("/api/auth", authRouter);

// //セッションIDが有効な時の/api/auth/loginの処理→/appにリダイレクト
// app.get("/login", async (req, res) => {
//   console.log(req.body);
// });

module.exports = app;
