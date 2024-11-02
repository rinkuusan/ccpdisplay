const Web3 = require('web3');

const web3 = new Web3('https://rpc.defi-verse.org/');
const tokenPairAddress = '0x4724b6bfe09a27ea04ada9c341997aa44cbddd8100020000000000000000000b';
const tokenPairABI = [/* ここにABIを貼り付け */];
const tokenPairContract = new web3.eth.Contract(tokenPairABI, tokenPairAddress);

module.exports = async (req, res) => {
  try {
    const price = await tokenPairContract.methods.getPrice().call();
    res.status(200).json({ price });
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ error: '価格を取得できませんでした' });
  }
};
