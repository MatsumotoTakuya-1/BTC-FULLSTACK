const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

const db = require("../db");

describe("predictRouter", () => {
  let request;
  before(async () => {
    request = chai.request(app).keepOpen();
    await db.migrate
      .forceFreeMigrationsLock()
      .then(() => db.migrate.rollback({ all: true }))
      .then(() => db.migrate.latest())
      .catch(console.error);
  });

  after(() => {
    request.close();
  });

  describe("fetch yahoo finance", () => {
    it("should return status 200", async () => {
      const response = await request
        .post("/api/predict")
        .send({ symbol: "AAPL", range: "1w", model: "model1" });

      expect(response).to.have.status(200);
    });

    it("should return stockdata", async () => {
      const res = await request
        .post("/api/predict")
        .send({ symbol: "AAPL", range: "1w", model: "model1" });

      // console.log("🚀 ~ it ~ data:", res);
      data = res.body;

      expect(data).to.exist;
      expect(data).to.have.property("actual"); //指定した範囲の過去の株価
      expect(data).to.have.property("predicted"); //指定した範囲の予測値
      expect(data).to.have.property("actualDates"); //指定した範囲の過去の日付
      expect(data).to.have.property("predictedDates"); //指定した範囲の未来の日付
      expect(data).to.have.property("range"); //過去の指定範囲
      expect(data).to.have.property("model"); //予測モデル
      expect(data).to.have.property("created_at"); //res時の時間
      expect(data.company).to.have.property("name"); //会社の名前
      expect(data.company).to.have.property("exchange"); //株式上場してるところ
      expect(data.company).to.have.property("currency"); //通貨
    });

    it("should insert stock data to db(histories)", async () => {
      const res = await request
        .post("/api/predict")
        .send({ symbol: "TSLA", range: "1w", model: "model1" });

      const findDb = (await db.select().from("histories")).at(-1);
      // console.log("🚀 ~ it ~ findDb:", findDb);
      expect(findDb).to.exist;
      expect(findDb.symbol).to.equal("TSLA");
      expect(findDb.range).to.equal("1w");
      expect(findDb.model).to.equal("model1");
    });
  });
});
