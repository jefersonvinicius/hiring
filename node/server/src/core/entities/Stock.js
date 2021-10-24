"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
class Stock {
    constructor(data) {
        this.name = data.name;
        this.price = data.price;
        this.pricedAt = data.pricedAt;
    }
}
exports.Stock = Stock;
