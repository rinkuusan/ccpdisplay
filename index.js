const Web3 = require('web3');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Web3のインスタンスを作成
const web3 = new Web3('https://rpc.defi-verse.org/');

// トークンペアのコントラクトアドレスとABIを設定
const tokenPairAddress = '0xYourTokenPairAddress';
const tokenPairABI = [/* ここにABIを貼り付け */];

// コントラクトインスタンスを作成
const tokenPairContract = new web3.eth.Contract(tokenPairABI, tokenPairAddress);

// ペア価格を取得する関数
async function getPairPrice() {
  try {
    // 必要なデータをコントラクトから取得
    const price = await tokenPairContract.methods.getPrice().call();
    return price;
  } catch (error) {
    console.error('エラー:', error);
    return null;
  }
}

// APIエンドポイントの作成
app.get('/price', async (req, res) => {
  const price = await getPairPrice();
  if (price) {
    res.json({ price });
  } else {
    res.status(500).send('価格を取得できませんでした');
  }
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーがポート${port}で起動しました`);
});
