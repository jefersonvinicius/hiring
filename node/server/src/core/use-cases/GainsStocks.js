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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GainsStocksUseCase = void 0;
const Clock_1 = require("@app/shared/Clock");
const StockNotFound_1 = require("../errors/StockNotFound");
class GainsStocksUseCase {
    constructor(stockingAPI) {
        this.stockingAPI = stockingAPI;
    }
    execute(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { purchasedAmount, purchasedAt, stockName } = params;
            const historyStock = yield this.stockingAPI.fetchStockHistory(stockName, purchasedAt, Clock_1.Clock.now());
            if (!historyStock)
                throw new StockNotFound_1.StockNotFound(stockName);
            const { history } = historyStock;
            const purchasedPrice = (_a = history[history.length - 1]) === null || _a === void 0 ? void 0 : _a.closing;
            const currentPrice = history[0].closing;
            const purchasedTotal = purchasedAmount * purchasedPrice;
            const currentTotal = purchasedAmount * currentPrice;
            return {
                name: stockName,
                lastPrice: currentPrice,
                priceAtDate: purchasedPrice,
                purchasedAmount,
                purchasedAt,
                capitalGains: currentTotal - purchasedTotal,
            };
        });
    }
}
exports.GainsStocksUseCase = GainsStocksUseCase;
