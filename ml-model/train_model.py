import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib


# 📈 学習データ取得（AAPL 1年分）
df = yf.download("AAPL", period="1y")

# 🧹 欠損処理
df = df[["Close"]].dropna() #`df` から「Close（終値）」列だけを抽出し,NaN`（欠損値）がある行を **削除**


# 📊 特徴量の作成（前日終値と前日比リターン）
df["PrevClose"] = df["Close"].shift(1) #１日前をpreCloseに代入
df["Return"] = df["Close"].pct_change().shift(1) # `.pct_change()` は `(今日 - 昨日) / 昨日` を計算.`.shift(1)` で **前日のリターンを今日のデータに合わせる**
df["Target"] = df["Close"]
df = df.dropna()
# | Close | PrevClose | Return  | Target |
# |-------|-----------|---------|--------|
# | 105   | 100       | 0.05    | 105    |
# | 110   | 105       | 0.0476  | 110    |
# | ...   | ...       | ...     | ...    |

# 📦 特徴量と正解データ
X = df[["PrevClose", "Return"]] #pandas.DataFrame
y = df["Target"] ## ← pandas.Series

model2 = LinearRegression()
model2.fit(X, y) #model.fit(X, y) のような学習や predict(X) の実行時には、内部的に自動で NumPy 配列に変換されて処理
joblib.dump(model2, "model2.pkl")