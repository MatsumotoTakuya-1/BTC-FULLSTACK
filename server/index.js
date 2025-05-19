const express = require("express");
const cors = require("cors");
const path = require("path");
const predictRouter = require("./routers/predictRouter");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// dist 配信
app.use(express.static(path.join(__dirname, "./public")));

app.use("/api", predictRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
