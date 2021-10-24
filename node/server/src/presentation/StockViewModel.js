"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockViewModel = void 0;
const Clock_1 = require("@app/shared/Clock");
const _1 = require(".");
class StockViewModel extends _1.ViewModel {
    get stockName() {
        return this.data.name;
    }
    toJSON() {
        return {
            name: this.data.name,
            lastPrice: this.data.price,
            pricedAt: Clock_1.Clock.format(this.data.pricedAt, 'yyyy-MM-dd'),
        };
    }
}
exports.StockViewModel = StockViewModel;
