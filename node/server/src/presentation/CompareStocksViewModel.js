"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareStocksViewModel = void 0;
const _1 = require(".");
const StockViewModel_1 = require("./StockViewModel");
class CompareStocksViewModel extends _1.ViewModel {
    toJSON() {
        return {
            lastPrices: this.data.map((stock) => new StockViewModel_1.StockViewModel(stock)),
        };
    }
}
exports.CompareStocksViewModel = CompareStocksViewModel;
