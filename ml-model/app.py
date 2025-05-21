
from flask import Flask, request, jsonify
# Flask: Web API サーバーを作るための軽量フレームワーク
# request: フロントエンドなどから送られてくるリクエスト（データ）を扱う
# jsonify: Pythonの辞書（dict）を JSON形式で返す
import joblib  # ← pkl を読み込む
import numpy as np
from flask_cors import CORS

app = Flask(__name__) #Flask サーバーを生成
CORS(app)




# モデルの読み込み
model2 = joblib.load('model2.pkl')

@app.route("/")
def index():
    return "👋 Flask サーバーは正常に動作しています！"

# @app.route("/predict")
# def index():
#     return "👋 Flask サーバーは正常に動作しています！"

if __name__ == "__main__":
    app.run(port=5000)