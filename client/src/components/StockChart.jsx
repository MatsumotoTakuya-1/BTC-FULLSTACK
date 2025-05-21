import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

function StockChart({ data }) {
  const {
    actual,
    actualDates,
    predicted,
    predictedDates,
    company,
    range,
    model,
    annualReturn,
    annualResk,
  } = data;
  //   console.log(company);

  // 実データと日付を結合（チャート描画用）
  const actualPoints = actualDates.map((date, i) => ({
    date,
    actual: actual[i] ?? null,
    predicted: null, // 実データ側には予測なし
  }));

  // 予測データと未来の日付を結合（チャート描画用）
  const predictedPoints = predictedDates.map((date, i) => ({
    date,
    actual: null, // 予測側には実データなし
    predicted: predicted[i] ?? null,
  }));

  // 実データと予測を1本のチャートにまとめる
  const chartData = [...actualPoints, ...predictedPoints];
  console.log("🚀 ~ StockChart ~ chartData:", chartData);

  return (
    <div>
      {company && (
        <>
          <strong>{company.name} </strong>({company.exchange}/{" "}
          {company.currency})<div>表示/予測範囲：{range}</div>
          <div>使用モデル：{model}</div>
          <div>年次平均リターン:{(annualReturn * 100).toFixed(2)}%</div>
          <div>リスク(年次標準偏差):{(annualResk * 100).toFixed(2)}%</div>
        </>
      )}
      {/* サイズ指定しないとlinechartは描画されない */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            name="実データ"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#82ca9d"
            name="予測"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;
