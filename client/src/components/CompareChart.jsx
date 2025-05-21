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

  //最も未来までの日数を基準にする。選択したrange毎に予測範囲が違うから
  const maxLength = Math.max(
    ...selectedStock.map((stock) => stock.predicted.length)
  );

  const chartData = [];
  for (let i = 0; i < maxLength; i++) {
    const row = { date: selectedStock[0].predictedDates[i] || `${i + 1}日` };
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
            <Line
              key={index}
              type="monotone"
              dataKey={`${stock.symbol}-${stock.model}`}
              stroke={`hsl(${index * 50}, 70%, 50%)`}
              dot={false}
            />;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompareChart;
