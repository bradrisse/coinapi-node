const CoinAPI = require('./index.js');
var coinapi = new CoinAPI('YOUR-API-HERE');

//Lists

// coinapi.listExchanges().then(function(data) {
// 	var exchanges = [];
// 	for (var i = 0; i < data.length; i++) {
// 		var exchange = data[i];
// 		exchanges.push(exchange.name)
// 	}

// 	exchanges.sort()

// 	console.log(exchanges)
// })

// coinapi.listAssets().then(function(data) {
// 	console.log('assets ', data)
// })

coinapi.listSymbols().then(function(data) {
	console.log('symbols ', data)
})


//Rates

// coinapi.exchangeRate('BTC', 'USD', '2017-08-09T14:31:18.3150000Z').then(function(data) {
// 	console.log('exchange rate ', data)
// })

// coinapi.currentRates('BTC').then(function(data) {
// 	console.log('current rates ', data)
// })

//OHLCV

// coinapi.listOHLCVPeriods().then(function(data) {
// 	console.log('ohlcv periods ', data)
// })

// coinapi.latestOHLCV('POLONIEX_SPOT_XRP_BTC', '1MIN').then(function(data) {
// 	console.log('latest OHLCV ', data)
// })

// coinapi.historicalOHLCV('POLONIEX_SPOT_BTC_USDT', '1DAY', '2018-08-07T00:00:00', '2018-08-07T11:26:00').then(function(data) {
// 	console.log('latest OHLCV ', data)
// })

//Quotes

// coinapi.quotesCurrent('BITSTAMP_SPOT_BTC_USD').then(function(data) {
// 	console.log('quotes Current ', data)
// })

// coinapi.quotesLatest().then(function(data) {
// 	console.log('quotes latest ', data)
// })

// coinapi.quotesHistorical('BITSTAMP_SPOT_BTC_USD', '2016-01-01T00:00:00').then(function(data) {
// 	console.log('quotes Historical ', data)
// })


//OrderBook

// coinapi.currentOrderbook('BITSTAMP_SPOT_BTC_USD').then(function(data) {
// 	console.log('current Orderbook ', data)
// })

// coinapi.latestOrderbook('BITSTAMP_SPOT_BTC_USD').then(function(data) {
// 	console.log('latest orderbook ', data)
// })

// coinapi.historicalOrderbook('BITSTAMP_SPOT_BTC_USD', '2016-01-01T00:00:00').then(function(data) {
// 	console.log('historical orderbook ', data)
// })


//WebSocket

// coinapi.openWebSocket(['trade', 'quote', 'book'])

// coinapi.on('trade', (data) => {
// 	//console.log('trade ', data)
// });

// coinapi.on('quote', (data) => {
// 	//console.log('quote ', data)
// });

// coinapi.on('book', (data) => {
// 	console.log('book ', data)
// });

// coinapi.on('heartbeat', (data) => {
// 	console.log('heartbeat ', data)
// });