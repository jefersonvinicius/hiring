"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockGainsViewModel = void 0;
const Clock_1 = require("@app/shared/Clock");
const _1 = require(".");
class StockGainsViewModel extends _1.ViewModel {
    toJSON() {
        return Object.assign(Object.assign({}, this.data), { purchasedAt: Clock_1.Clock.format(this.data.purchasedAt, 'yyyy-MM-dd') });
    }
}
exports.StockGainsViewModel = StockGainsViewModel;
