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

router.get("/favorite", async (req, res) => {
  const userId = req.userId;
  // console.log("🚀 ~ router.get ~ userId:", userId);

  const results = await db("histories")
    .where({ user_id: userId, favorite: true }) //ログインユーザに限定
    .orderBy("created_at", "desc")
    .limit(30);
  res.json(results);
});

router.patch("/favorite/:id", async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== "boolean") {
    return res
      .status(400)
      .json({ error: "favoriteはbooleanである必要があります" });
  }

  await db("histories")
    .where({ id: id, user_id: userId }) //ログインユーザに限定
    .update({ favorite });

  res.sendStatus(200);
});

module.exports = router;
