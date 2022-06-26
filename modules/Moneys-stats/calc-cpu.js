async function calculateCPU(client, crypto) {
    const orders = await client.getOrders();
    const productsId = [...new Set(orders.map(o => o.product_id).filter(o => o.split('-').includes(crypto)))];

    const trades = await Promise.all(productsId.map(pid => client.getFills(pid))).then(res => res.flat());
    
    const sum = arr => arr.reduce((ps, a) => ps + a, 0);
    let buys = [];
    let sells = [];

    for(const trade of trades) {
        if(trade.product_id.split('-').at(0) == crypto) {
            if(trade.side == 'buy') {
                buys.push({'usd': trade.usd_volume, 'qty': trade.size});
            } else {
                sells.push({'usd': trade.usd_volume, 'qty': trade.size * trade.price});
            }
        } else {
            if(trade.side == 'buy') {
                sells.push({'usd': trade.usd_volume, 'qty': trade.size * trade.price});
            } else {
                buys.push({'usd': trade.usd_volume, 'qty': trade.size * trade.price});
            }
        }
    }

    let sumUsdBuy = sum(buys.map(b => parseFloat(b.usd)));
    let sumQtyBuy = sum(buys.map(b => parseFloat(b.qty)));
    let sumQtySell = sum(sells.map(s => parseFloat(s.qty)));

    return {
        'qty': sumQtyBuy - sumQtySell,
        'avgPrice': sumUsdBuy / sumQtyBuy, 
    };
}

export { calculateCPU };