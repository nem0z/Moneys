import Client from "./modules/CBPro-API/Client.js";
import { calculateCPU } from './modules/Moneys-stats/calc-cpu.js';
import keys from './keys.js';

const client = new Client(keys.API_KEY, keys.API_SECRET, keys.PASSPHRASE);
let accounts = await client.getAccounts(true);
const prices = await client.getPrice();

console.log(accounts);

const cpuBTC = await calculateCPU(client, 'BTC');
console.log(`${cpuBTC.qty} BTC bought at an average price of ${cpuBTC.avgPrice.toFixed(2)}$ ${prices.prices['BTC'] ? `(${ ((prices.prices['BTC'] - cpuBTC.avgPrice) / cpuBTC.avgPrice * 100).toFixed(2)}%)` : ''} !`);

const cpuETH = await calculateCPU(client, 'ETH');
console.log(`${cpuETH.qty} ETH bought at an average price of ${cpuETH.avgPrice.toFixed(2)}$ ${prices.prices['ETH'] ? `(${ ((prices.prices['ETH'] - cpuETH.avgPrice) / cpuETH.avgPrice * 100).toFixed(2)}%)` : ''} !`);
