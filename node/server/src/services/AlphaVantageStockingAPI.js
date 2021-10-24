"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalDateInvalidError = exports.APIKeyNotProvidedError = exports.AlphaVantageStockingAPI = exports.alphaVantageApi = void 0;
const Stock_1 = require("@app/core/entities/Stock");
const axios_1 = __importDefault(require("axios"));
const Clock_1 = require("@app/shared/Clock");
const HistoryPrice_1 = require("@app/core/entities/HistoryPrice");
exports.alphaVantageApi = axios_1.default.create({
    baseURL: 'https://www.alphavantage.co',
});
class AlphaVantageStockingAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        if (!this.apiKey)
            throw new APIKeyNotProvidedError();
    }
    fetchByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/query?function=GLOBAL_QUOTE&symbol=${name}&apikey=${this.apiKey}`;
            const { data } = yield exports.alphaVantageApi.get(url);
            const info = data['Global Quote'];
            if (!info || !info['01. symbol'])
                return null;
            return new Stock_1.Stock({
                name: info['01. symbol'],
                price: Number(info['05. price']),
                pricedAt: new Date(info['07. latest trading day']),
            });
        });
    }
    fetchStockHistory(name, initialDate, finalDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Clock_1.Clock.isAfterNow(finalDate))
                throw new FinalDateInvalidError(finalDate);
            const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${name}&outputsize=full&apikey=${this.apiKey}`;
            const { data } = yield exports.alphaVantageApi.get(url);
            const historyData = data['Time Series (Daily)'];
            if (!historyData)
                return null;
            const entries = Object.entries(historyData);
            if (finalDateIsBeforeTheFirstEntry())
                return emptyHistory();
            const { startIndex, finalIndex } = getRangeIndex();
            const entriesWithinRangeDate = entries.slice(startIndex, finalIndex + 1);
            return {
                stockName: name,
                history: entriesWithinRangeDate.map(createHistoryPriceFromEntry),
            };
            function createHistoryPriceFromEntry(entry) {
                const [dateStr, values] = entry;
                return new HistoryPrice_1.HistoryPrice({
                    opening: Number(values['1. open']),
                    closing: Number(values['4. close']),
                    low: Number(values['3. low']),
                    high: Number(values['2. high']),
                    volume: Number(values['5. volume']),
                    pricedAt: new Date(dateStr),
                });
            }
            function getRangeDate() {
                const initialDateStr = getInitialDateStr(initialDate, historyData);
                const finalDateStr = getFinalDateStr(finalDate, historyData);
                return { initialDateStr, finalDateStr };
            }
            function getRangeIndex() {
                const { initialDateStr, finalDateStr } = getRangeDate();
                const finalIndex = entries.findIndex(([dateStr]) => initialDateStr === dateStr);
                const startIndex = entries.findIndex(([dateStr]) => finalDateStr === dateStr);
                return { startIndex, finalIndex };
            }
            function finalDateIsBeforeTheFirstEntry() {
                const dateOfFirstEntry = new Date(entries[entries.length - 1][0]);
                return Clock_1.Clock.isBefore(finalDate, dateOfFirstEntry);
            }
            function emptyHistory() {
                return {
                    stockName: name,
                    history: [],
                };
            }
        });
    }
}
exports.AlphaVantageStockingAPI = AlphaVantageStockingAPI;
function getInitialDateStr(initialDate, historyData) {
    let date = initialDate;
    let dateStr = Clock_1.Clock.format(date, 'yyyy-MM-dd');
    while (true) {
        if (historyData[dateStr])
            break;
        date = Clock_1.Clock.addDays(date, 1);
        dateStr = Clock_1.Clock.format(date, 'yyyy-MM-dd');
    }
    return dateStr;
}
function getFinalDateStr(finalDate, historyData) {
    let date = finalDate;
    let dateStr = Clock_1.Clock.format(date, 'yyyy-MM-dd');
    while (true) {
        if (historyData[dateStr])
            break;
        date = Clock_1.Clock.subtractDays(date, 1);
        dateStr = Clock_1.Clock.format(date, 'yyyy-MM-dd');
    }
    return dateStr;
}
class APIKeyNotProvidedError extends Error {
    constructor() {
        super('The alpha vantage api need an API key');
    }
}
exports.APIKeyNotProvidedError = APIKeyNotProvidedError;
class FinalDateInvalidError extends Error {
    constructor(date) {
        super(`The final date ${date.toUTCString()} is invalid.`);
    }
}
exports.FinalDateInvalidError = FinalDateInvalidError;
