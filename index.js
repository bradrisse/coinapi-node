const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');

const restAPIURL = 'https://rest.coinapi.io';
const WebSocketURL = 'wss://ws.coinapi.io/v1/';

class CoinAPI extends EventEmitter {

    constructor(key) {
        super();
        const instance = axios.create({
            baseURL: restAPIURL,
            headers: { 'X-CoinAPI-Key': key }
        });

        this.key = key;
        this.instance = instance;
        this.ws = {};
    }

    _request(path) {
        const self = this;
        return new Promise(function(resolve, reject) {
            self.instance.get(path)
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    console.log('error ', error)
                    reject(error);
                })
        })
    }

    _getParamString(params) {
        Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
        var paramString = Object.keys(params).map(function(key) {
            if (params[key]) {
                return key + '=' + params[key];
            }
        }).join('&')
        return Object.keys(params).length > 0 ? '?' + paramString : '';
    }

    /**
     * Docs: https://docs.coinapi.io/#list-all-exchanges
     */

    listExchanges() {
        return this._request('/v1/exchanges')
    }

    /**
     * Docs: https://docs.coinapi.io/#list-all-assets
     */

    listAssets() {
        return this._request('/v1/assets')
    }

    /**
     * Docs: https://docs.coinapi.io/#list-all-symbols
     */

    listSymbols(filter_symbol_id) {
        const params = this._getParamString({
            filter_symbol_id: filter_symbol_id
        });
        return this._request(`/v1/symbols${params}`)
    }

    /**
     * Docs: https://docs.coinapi.io/#exchange-rates
     */

    exchangeRate(base, quote, time) {
        const params = this._getParamString({
            time: time
        });
        return this._request(`/v1/exchangerate/${base}/${quote}${params}`)
    }

    /**
     * Docs: https://docs.coinapi.io/#get-all-current-rates
     */

    currentRates(base, time) {
        const params = this._getParamString({
            time: time
        });
        return this._request(`/v1/exchangerate/${base}`)
    }

    /**
     * Docs: https://docs.coinapi.io/#list-all-periods
     */

    listOHLCVPeriods(base) {
        return this._request('/v1/ohlcv/periods')
    }

    /**
     * https://docs.coinapi.io/#latest-data
     */

    latestOHLCV(symbol_id, period_id, limit) {
        const params = this._getParamString({
            period_id: period_id,
            limit: limit
        });

        console.log('latestOHLCV ', `/v1/ohlcv/${symbol_id}/latest${params}`)
        return this._request(`/v1/ohlcv/${symbol_id}/latest${params}`)
    }

    /**
     * Docs: https://docs.coinapi.io/#historical-data
     */

    historicalOHLCV(symbol_id, period_id, time_start, time_end, limit) {
        const params = this._getParamString({
            period_id: period_id,
            time_start: time_start,
            time_end: time_end,
            limit: limit
        });
        return this._request(`/v1/ohlcv/${symbol_id}/history${params}`)
    }

    /**
     * Docs: https://docs.coinapi.io/#current-data32
     */

    quotesCurrent(filter_symbol_id) {
        const params = this._getParamString({
            filter_symbol_id: filter_symbol_id
        });
        return this._request(`/v1/quotes/current${params}`)
    }

    /**
     * Docs: https://docs.coinapi.io/#latest-data33
     */

    quotesLatest(filter_symbol_id, limit) {
        const params = this._getParamString({
            filter_symbol_id: filter_symbol_id,
            limit: limit
        });
        return this._request(`/v1/quotes/latest${params}`)
    }

    /**
     * Docs: https://docs.coinapi.io/#historical-data34
     */

    quotesHistorical(symbol_id, time_start, time_end, limit) {
        const params = this._getParamString({
            time_start: time_start,
            time_end: time_end,
            limit: limit
        });
        return this._request(`/v1/quotes/${symbol_id}/history${params}`)
    }

    /**
     * Description: Get current order book snapshot for all or a specific symbol.
     * Docs: https://docs.coinapi.io/#current-data37
     */

    currentOrderbook(filter_symbol_id, limit_levels) {
        const params = this._getParamString({
            filter_symbol_id: filter_symbol_id,
            limit_levels: limit_levels
        });
        return this._request(`/v1/orderbooks/current${params}`)
    }

    /**
     * Description: Get latest order book snapshots for a specific symbol, returned in time descending order.
     * Docs: https://docs.coinapi.io/#latest-data38
     */

    latestOrderbook(symbol_id, limit, limit_levels) {
        const params = this._getParamString({
            limit: limit,
            limit_levels: limit_levels
        });
        return this._request(`/v1/orderbooks/${symbol_id}/latest${params}`)
    }

    /**
     * Description: Get historical order book snapshots for a specific symbol within time range, returned in time ascending order.
     * Docs: https://docs.coinapi.io/#historical-data39
     */

    historicalOrderbook(symbol_id, time_start, time_end, limit, limit_levels) {
        const params = this._getParamString({
            time_start: time_start,
            time_end: time_end,
            limit: limit,
            limit_levels: limit_levels
        });
        return this._request(`/v1/orderbooks/${symbol_id}/history${params}`)
    }

    openWebSocket(subscribe_data_type) {
        const self = this;
        this.ws = new WebSocket(WebSocketURL);
        this.ws.on('open', function open() {
            var hello = {
                "type": "hello",
                "apikey": self.key, //this.key
                "heartbeat": false,
                "subscribe_data_type": subscribe_data_type,
                "subscribe_filter_symbol_id": []
            };
            self.ws.send(JSON.stringify(hello));
        });

        this.ws.on('message', function incoming(data) {
            data = JSON.parse(data)

            if (data.type === 'error') {
                console.log(data.message)
            }

            if (data.type === 'trade') {
                self.emit('trade', data);
            }

            if (data.type === 'book') {
                self.emit('book', data);
            }

            if (data.type === 'heartbeat') {
                self.emit('heartbeat', data);
            }
        })
    }
}

module.exports = CoinAPI;