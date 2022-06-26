import fetch from 'node-fetch';
import crypto from 'node:crypto';

class Client {
    constructor(API_KEY, API_SECRET, PASSPHRASE) {
        this.API_KEY = API_KEY;
        this.PASSPHRASE = PASSPHRASE;
        this.API_SECRET = API_SECRET;
    }


    generateSignature(method, path, body='') {
        const TIMESTAMP = Date.now() / 1000;
        const MESSAGE = TIMESTAMP + method + path + body;

        const SIGN = crypto.createHmac('sha256', Buffer.from(this.API_SECRET, 'base64')).update(MESSAGE).digest('base64');
    
        return {
            timestamp: TIMESTAMP,
            sign: SIGN,
        };
    }


    request(url, method, path, body='') {
        const signature = this.generateSignature(method, path, body);
        const params = {
            'method': method,
            'headers': {
                'CB-ACCESS-KEY': this.API_KEY,
                'CB-ACCESS-SIGN': signature.sign,
                'CB-ACCESS-TIMESTAMP': signature.timestamp,
                'CB-ACCESS-PASSPHRASE': this.PASSPHRASE,
            }
        };

        return fetch(url, params);
    }


    getAccounts(filter) {
        return this.request('https://api.exchange.coinbase.com/accounts', 'GET', '/accounts', '')
                .then(res => res.json())
                .then(accounts => filter ? accounts.filter(acc => acc.balance > 0) : accounts)
                .catch(err =>  {
                    console.error(err); 
                    return err;
                });
    }

    getOrders() {
        return this.request('https://api.exchange.coinbase.com/orders?sortedBy=created_at&sorting=desc&limit=1000&status=done', 'GET', '/orders?sortedBy=created_at&sorting=desc&limit=1000&status=done', '')
        .then(res => res.json())
        .catch(err =>  {
            console.error(err); 
            return err;
        });
    }


    getFills(productId) {
        return this.request(`https://api.exchange.coinbase.com/fills?product_id=${productId}`, 'GET', `/fills?product_id=${productId}`, '')
        .then(res => res.json())
        .catch(err =>  {
            console.error(err); 
            return err;
        });
    }


    getPrice() {
        return this.request(`https://api.exchange.coinbase.com/oracle`, 'GET', `/oracle`, '')
        .then(res => res.json())
        .catch(err =>  {
            console.error(err); 
            return err;
        });
    }
}

export default Client;