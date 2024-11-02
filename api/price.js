const Web3 = require('web3');

const web3 = new Web3('https://rpc.defi-verse.org/');

// CCPとWOASのペアのプールアドレス
const pairAddress = '0x4724b6bfe09a27EA04aDa9C341997aA44CbDdD81';

// Uniswapのような標準的なERC-20ペアコントラクトABI
const pairABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      { "internalType": "uint112", "name": "_reserve0", "type": "uint112" },
      { "internalType": "uint112", "name": "_reserve1", "type": "uint112" },
      { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const pairContract = new web3.eth.Contract(pairABI, pairAddress);

// 価格を取得する関数
async function getCCPPriceInWOAS() {
  try {
    // getReservesで流動性プールのリザーブを取得
    const reserves = await pairContract.methods.getReserves().call();
    
    // CCPとWOASのリザーブ量（必要に応じてreserve0, reserve1を確認）
    const reserveCCP = reserves._reserve0;
    const reserveWOAS = reserves._reserve1;
    
    // CCPの価格をWOASで計算
    const price = reserveWOAS / reserveCCP;
    return price;
  } catch (error) {
    console.error('エラー:', error);
    return null;
  }
}

// Expressを用いたAPIエンドポイント
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/price', async (req, res) => {
  const price = await getCCPPriceInWOAS();
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
