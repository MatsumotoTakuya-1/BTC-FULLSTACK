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
app.use(cookieParser()); // express でcookieを取得

//認証用ミドルウェア
const authMiddeware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    next();
  } else {
    return res.status(401).json({ error: "認証に失敗しました" });
  }
};

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

// /apiで始まるURLへのアクセスは意図してないので"/"にリダイレクト。
//開発環境だとfrontのポートにリダイレクト、本番環境だとフロントはビルドするのでサーバのポートにリダイレクト
app.use((req, res, next) => {
  if (
    req.path.startsWith("/api") &&
    // req.headers.accept &&
    req.headers.accept.includes("text/html") //これないと他のリクエストもリダイレクトしてしまう。直接url叩いた時だけリダイレクト
  ) {
    return res.redirect("/");
  }
  next();
});

app.get("/api/app", authMiddeware, (req, res) => {
  res.status(200).json({ message: "認証に成功しました" });
});
app.use("/api/predict", authMiddeware, predictRouter);
app.use("/api/history", authMiddeware, historyRouter);

app.use("/api/auth", authRouter); //login,ユーザ登録は認証不要

module.exports = app;
