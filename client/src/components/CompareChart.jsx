import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function CompareChart({ selectedStock }) {
  //data = [{履歴の株式情報},{},...]
  if (selectedStock.length === 0) return <p>比較対象が選択されてません</p>;

  const baseRange = selectedStock[0].range;
  console.log("🚀 ~ CompareChart ~ baseRange:", baseRange);
  const sameRangeStocks = selectedStock.filter((stock) => {
    console.log("🚀 ~ sameRangeStocks ~ stock:", stock.range === baseRange);
    stock.range === baseRange;
  });
  console.log("🚀 ~ sameRanegeSrocks ~ sameRanegeSrocks:", sameRangeStocks);

  console.log(
    "🚀 ~ CompareChart ~ selectedStock.length:",
    selectedStock.length
  );
  if (sameRangeStocks.length !== selectedStock.length) {
    return <p>比較対象は同じ表示期間で選んでください</p>;
  }

  const actualLength = selectedStock[0].actual.length;
  const predictedLength = selectedStock[0].predicted.length;

  const chartData = [];

  //actual(過去の実データ）データを作成
  for (let i = 0; i < actualLength; i++) {
    const row = { date: selectedStock[0].actualDates[i] };
    selectedStock.forEach((stock) => {
      row[`${stock.symbol}-${stock.model}`] = stock.actual[i];
    });
    chartData.push(row);
  }

  //predictデータを作成
  for (let i = 0; i < predictedLength; i++) {
    const row = { date: selectedStock[0].predictedDates[i] };
    selectedStock.forEach((stock) => {
      row[`${stock.symbol}-${stock.model}`] = stock.predicted[i];
    });
    chartData.push(row);
  }
  console.log("🚀 ~ CompareChart ~ chartData:", chartData);

  //chartData = [{date:"2025-05-22", "AAPL-model1":184, "TSLA-model2":180},{..},...]

  return (
    <div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedStock.map((stock, index) => {
            return (
              <Line
                key={index}
                type="monotone"
                dataKey={`${stock.symbol}-${stock.model}`}
                stroke={`hsl(${index * 50}, 70%, 50%)`}
                dot={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompareChart;
