const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/history", async (req, res) => {
  const results = await db("histories").orderBy("created_at", "desc").limit(20);
  res.json(results);
});

router.delete("/history/:id", async (req, res) => {
  const { id } = req.params;
  await db("histories").where({ id }).del();
  res.sendStatus(204);
});

module.exports = router;
