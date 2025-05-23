import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Container,
  Box,
  Typography,
  Button,
  Divider,
  Paper,
} from "@mui/material";

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
      <Paper sx={{ p: 2, mb: 1 }}>
        {company && (
          <>
            <Typography variant="body2" align="center">
              <strong>{company.name} </strong>({company.exchange}/{" "}
              {company.currency})
            </Typography>
            <Typography variant="body2" align="center">
              表示/予測範囲：{range}
            </Typography>
            <Typography variant="body2" align="center">
              使用モデル：{model}
            </Typography>
            <Typography variant="body2" align="center">
              年次平均リターン:{(annualReturn * 100).toFixed(2)}%
            </Typography>
            <Typography variant="body2" align="center">
              リスク(年次標準偏差):{(annualResk * 100).toFixed(2)}%
            </Typography>
          </>
        )}
      </Paper>
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
            stroke="#4169e1"
            name="実データ"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#008000"
            name="予測"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;
