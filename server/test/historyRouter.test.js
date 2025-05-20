const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const db = require("../db");
const { expect } = chai;

chai.use(chaiHttp);

describe("historyRouter", () => {
  let request;
  let insertId;

  before(async () => {
    request = chai.request(app).keepOpen();

    //初期データ挿入
    const [id] = await db("histories")
      .insert({
        symbol: "AAPL",
        actual: [
          212.92999267578125, 212.3300018310547, 211.4499969482422,
          211.25999450683594, 208.77999877929688,
        ],
        actualDates: [
          "2025 - 05 - 13",
          "2025 - 05 - 14",
          "2025 - 05 - 15",
          "2025 - 05 - 16",
          "2025 - 05 - 19",
        ],
        predicted: [211, 213, 215, 217, 219, 222, 224],
        predictedDates: [
          "2025 - 05 - 21",
          "2025 - 05 - 22",
          "2025 - 05 - 23",
          "2025 - 05 - 24",
          "2025 - 05 - 25",
          "2025 - 05 - 26",
          "2025 - 05 - 27",
        ],
        company: JSON.stringify({
          name: "Apple Inc.",
          currency: "USD",
          exchange: "NasdaqGS",
        }),
        created_at: new Date(),
        range: "1m",
        model: "model1",
      })
      .returning("id");

    insertId = id.id;
    // console.log("🚀 ~ before ~ insertId:", insertId);
  });

  after(async () => {
    // クリーンアップ
    await db("histories").where({ id: insertId }).del();
    request.close();
  });

  describe("get /api/history", () => {
    it("should return historyList", async () => {
      const response = await request.get("/api/history");
      expect(response).to.have.status(200);
      expect(response.body).to.be.an("array");
    });

    it("should return stockdata from history", async () => {
      const response = await request.get("/api/history");

      data = response.body[0];
      // console.log("🚀 ~ it ~ data:", data);

      if (data !== undefined) {
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
      } else {
        expect(data).to.equal(undefined);
      }
    });
  });
});
