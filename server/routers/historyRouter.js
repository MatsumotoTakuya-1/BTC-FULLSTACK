const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/history", async (req, res) => {
  const results = await db("histories").orderBy("created_at", "desc").limit(20);
  res.json(results);
});

module.exports = router;
