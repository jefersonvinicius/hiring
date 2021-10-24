"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryPrice = void 0;
class HistoryPrice {
    constructor(data) {
        this.opening = data.opening;
        this.low = data.low;
        this.high = data.high;
        this.closing = data.closing;
        this.pricedAt = data.pricedAt;
        this.volume = data.volume;
    }
}
exports.HistoryPrice = HistoryPrice;
