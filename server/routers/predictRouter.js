const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db");
const yahooFinance = require("yahoo-finance2").default;
const math = require("mathjs");

router.post("/", async (req, res) => {
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

    //リスクとリターンを求める-------------------
    const logReturns = []; //1日毎の対数リターン
    for (let i = 1; i < actual.length; i++) {
      if (actual[i] && actual[i - 1]) {
        const ret = Math.log(actual[i] / actual[i - 1]);
        logReturns.push(ret);
      }
    }

    //日次→年次のリターン、リスク
    const dailyMean = math.mean(logReturns);
    const dailystd = math.std(logReturns);
    const annualReturn = dailyMean * 252; //平均リターン（年次）
    const annualResk = dailystd * Math.sqrt(252); //標準偏差（年次）

    //年次リターン　→ 日次成長率
    const dailyGrowRate = Math.exp(annualReturn / 252);

    // ---------------------------------------

    // 検索した銘柄の予測値（終値と期間）---------
    const lastPrice = actual[actual.length - 1];
    // let predicted;
    // //長さ7の空配列 [undefined, undefined, ..., undefined]つくり、各要素に対して (_, i) => {...} を実行（iは0〜6）
    // predicted = Array.from({ length: days }, (_, i) =>
    //   Math.round(lastPrice * Math.pow(dailyGrowRate, i + 1))
    // );

    const predicted = randomWalk(lastPrice, dailyMean, dailystd, days);

    const predictedDates = Array.from({ length: days }, (_, i) => {
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
        annualReturn,
        annualResk,
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
      annualReturn,
      annualResk,
      created_at: new Date(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "株価取得に失敗しました" });
  }
});

//幾何ブラウン運動　St+1 = St * exp(μ＊Δt + σ* √Δt * ε)
function randomWalk(lastPrice, dailyReturn, dailyVolatilty, days) {
  const simulated = [];
  let price = lastPrice;

  for (let i = 0; i < days; i++) {
    const epsilon = randomNormal(0, 1); //正規分布からの乱数
    const growth = Math.exp(dailyReturn + dailyVolatilty * epsilon);
    price = price * growth;
    simulated.push(Math.round(price));
  }

  return simulated;
}

function randomNormal(mean = 0, stdDev = 1) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

module.exports = router;
