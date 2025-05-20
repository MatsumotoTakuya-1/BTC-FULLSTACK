const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db");
const yahooFinance = require("yahoo-finance2").default;

router.post("/predict", async (req, res) => {
  const { symbol, range = "1w", model = "model1" } = req.body;
  if (!symbol) return res.status(400).json({ error: "symbolは必須です" });
  try {
    let days;
    switch (range) {
      case "1m":
        days = 30;
        break;
      case "1y":
        days = 365;
        break;
      case "3y":
        days = 365 * 3;
        break;
      default:
        days = 7; // '1w
    }

    const now = new Date();
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // 指定した期間内の株価履歴（日次データ）を配列
    const chart = await yahooFinance.chart(symbol, {
      period1: from, // 開始日
      period2: now, // 終了日
      interval: "1d", // 1日ごとのデータ
    });

    // console.log(chart);

    const quotes = chart.quotes;

    // quotesの中身
    //     [
    //   {
    //     date: 2024-04-01T00:00:00.000Z,日付（Date型）
    //     open: 170.1,始値
    //     high: 172.3,高値
    //     low: 169.8,安値
    //     close: 171.5,終値
    //     volume: 73482000,終値
    //     adjClose: 171.5,調整後終値
    //   },
    //   {
    //     date: 2024-04-02T00:00:00.000Z,
    //     open: 171.4,
    //     high: 173.0,
    //     low: 170.5,
    //     close: 172.0,
    //     volume: 65400000,
    //     adjClose: 172.0,
    //   },
    //   ...
    // ]

    // 検索した銘柄の現在までの株価（終値と期間）---------
    // 日付 + 株価の整形
    const result = quotes.map((quote) => ({
      date: quote.date,
      close: quote.close ?? null,
    }));

    //終値ぬきだし,配列にする
    const actual = result.map((d) => d.close ?? null); // nullを保持する
    //dataを'YYYY-MM-DD'形式にする
    const actualDates = result.map((d) => d.date.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
    // ---------------------------------------

    // 検索した銘柄の予測値（終値と期間）---------
    const lastPrice = actual[actual.length - 1];
    let predicted;
    //長さ7の空配列 [undefined, undefined, ..., undefined]つくり、各要素に対して (_, i) => {...} を実行（iは0〜6）
    predicted = Array.from({ length: 7 }, (_, i) =>
      Math.round(lastPrice * Math.pow(1.01, i + 1))
    );

    const predictedDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return date.toISOString().slice(0, 10);
    });
    // ---------------------------------------

    //会社情報の取得）---------------------------
    const info = await yahooFinance.quote(symbol);
    const company = {
      name: info.longName || null,
      exchange: info.fullExchangeName || null,
      currency: info.currency || null,
    };
    // infoの中身
    //     {
    //   symbol: "AAPL",
    //   longName: "Apple Inc.",
    //   fullExchangeName: "NasdaqGS",
    //   regularMarketPrice: 192.32,
    //   regularMarketDayHigh: 193.2,
    //   regularMarketDayLow: 191.1,
    //   regularMarketPreviousClose: 190.4,
    //   regularMarketVolume: 73482000,
    //   logo_url: "https://logo.clearbit.com/apple.com",
    //   ...
    // }
    // ---------------------------------------

    await db("histories")
      .insert({
        symbol,
        actual,
        actualDates,
        predicted,
        predictedDates,
        company,
        range,
        model,
        created_at: new Date(),
      })
      .onConflict(["symbol", "range", "model"]) //ユニーク制約があり、組み合わせあれば
      .merge(); //既存なら更新、なければ挿入

    res.json({
      symbol,
      actual,
      actualDates,
      predicted,
      predictedDates,
      company,
      range,
      model,
      created_at: new Date(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "株価取得に失敗しました" });
  }
});

module.exports = router;
