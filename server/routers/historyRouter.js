const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const userId = req.userId;
  // console.log("🚀 ~ router.get ~ userId:", userId);

  const results = await db("histories")
    .where({ user_id: userId }) //ログインユーザに限定
    .orderBy("created_at", "desc")
    .limit(30);
  res.json(results);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db("histories").where({ id }).del();
  res.sendStatus(204);
});

module.exports = router;
