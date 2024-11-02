const Web3 = require('web3');

// Expressのインスタンス作成
const express = require('express');
const app = express();

// Vercelではポート指定が不要
const web3 = new Web3('https://rpc.defi-verse.org/');

const tokenPairAddress = '0x4724b6bfe09a27ea04ada9c341997aa44cbddd8100020000000000000000000b';
const tokenPairABI = [/* ここにABIを貼り付け */];
const tokenPairContract = new web3.eth.Contract(tokenPairABI, tokenPairAddress);

async function getPairPrice() {
  try {
    const price = await tokenPairContract.methods.getPrice().call();
    return price;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

app.get('/api/price', async (req, res) => {
  const price = await getPairPrice();
  if (price) {
    res.json({ price });
  } else {
    res.status(500).send('価格を取得できませんでした');
  }
});

module.exports = app;
