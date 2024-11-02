const Web3 = require('web3');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// RPCエンドポイントに接続
const web3 = new Web3('https://rpc.defi-verse.org/');

// CCP-WOASペアのプールアドレス
const pairAddress = '0x4724b6bfe09a27EA04aDa9C341997aA44CbDdD81';

// 標準的なERC-20ペアコントラクトABI（Uniswap互換）
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

// コントラクトインスタンスを作成
const pairContract = new web3.eth.Contract(pairABI, pairAddress);

// 元のコード内にある関数を上書き
async function getCCPPriceInWOAS() {
  try {
    // getReservesメソッドが存在するかチェック
    if (!pairContract.methods.getReserves) {
      console.log("getReservesメソッドが存在しません");
      return null;
    }

    console.log("getReservesメソッドが存在します。リザーブを取得します...");
    
    // getReservesメソッドを呼び出してリザーブを取得
    const reserves = await pairContract.methods.getReserves().call();
    
    console.log("取得したリザーブ:", reserves);
    
    // CCPとWOASのリザーブ量
    const reserveCCP = reserves._reserve0;
    const reserveWOAS = reserves._reserve1;

    // CCPの価格をWOASで計算
    const price = reserveWOAS / reserveCCP;
    console.log("計算した価格 (CCP/WOAS):", price);
    return price;
  } catch (error) {
    console.error('エラー発生:', error);
    return null;
  }
}


// APIエンドポイント
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
