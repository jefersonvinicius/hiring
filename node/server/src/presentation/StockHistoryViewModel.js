"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockHistoryViewModel = void 0;
const _1 = require(".");
const date_fns_1 = require("date-fns");
class StockHistoryViewModel extends _1.ViewModel {
    toJSON() {
        return {
            name: this.data.stockName,
            prices: this.data.history.map((item) => (Object.assign(Object.assign({}, item), { pricedAt: (0, date_fns_1.format)(item.pricedAt, 'yyyy-MM-dd') }))),
        };
    }
}
exports.StockHistoryViewModel = StockHistoryViewModel;
