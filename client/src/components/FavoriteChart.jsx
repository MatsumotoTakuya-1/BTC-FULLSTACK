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
import { Typography, Box, IconButton, Checkbox } from "@mui/material";

function FavoriteChart({ favorites }) {
  if (favorites.length === 0) return <p>比較対象が選択されてません</p>;

  //rangeが違えばチャート表示しない
  const baseRange = favorites[0].range;
  const sameRangeStocks = favorites.filter((stock) => {
    return stock.range === baseRange;
  });

  if (sameRangeStocks.length !== favorites.length) {
    return (
      <p>
        rangeが違うのでチャート表示機能は使用できません。ポートフォリオのrangeを合わせてください。
      </p>
    );
  }

  // ポートフォリオ全体のチャートーーーーーーーーーーーーーーーーーーーー
  const actualLength = favorites[0].actual.length || 0;
  const predictedLength = favorites[0].predicted.length;

  const totalActual = Array(actualLength).fill(0);
  const totalPredicted = Array(predictedLength).fill(0);

  //各銘柄毎に計算
  favorites.forEach((item) => {
    item.actual.forEach((value, i) => {
      totalActual[i] += value ?? 0; //nullあれば0
    });
    item.predicted.forEach((value, i) => {
      totalPredicted[i] += value ?? 0; //nullあれば0
    });
  });

  // 実データと日付を結合（チャート描画用）
  const actualPoints = favorites[0].actualDates.map((date, i) => ({
    date,
    actual: totalActual[i] ?? null,
    predicted: null, // 実データ側には予測なし
  }));

  // 予測データと未来の日付を結合（チャート描画用）
  const predictedPoints = favorites[0].predictedDates.map((date, i) => ({
    date,
    actual: null, // 予測側には実データなし
    predicted: totalPredicted[i] ?? null,
  }));

  // 実データと予測を1本のチャートにまとめる
  const chartData = [...actualPoints, ...predictedPoints];

  return (
    <div>
      <>
        <Typography variant="body1" align="center">
          <div>表示/予測範囲：{favorites[0].range}</div>
        </Typography>
      </>
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

export default FavoriteChart;
