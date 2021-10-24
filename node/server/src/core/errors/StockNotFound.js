"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockNotFound = void 0;
class StockNotFound extends Error {
    constructor(stockName) {
        super(`Stock with name ${stockName} not found `);
    }
}
exports.StockNotFound = StockNotFound;
