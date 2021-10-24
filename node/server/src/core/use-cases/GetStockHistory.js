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
exports.GetStockHistoryUseCase = exports.InvalidRangeDate = void 0;
const StockNotFound_1 = require("../errors/StockNotFound");
const MissingParamError_1 = require("@app/shared/errors/MissingParamError");
class InvalidRangeDate extends Error {
    constructor(initialDate, finalDate) {
        super(`The range date ${initialDate} to ${finalDate} is invalid`);
    }
}
exports.InvalidRangeDate = InvalidRangeDate;
class GetStockHistoryUseCase {
    constructor(stockingAPI) {
        this.stockingAPI = stockingAPI;
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stockName, initialDate, finalDate } = params;
            if (!stockName || !stockName.trim())
                throw new MissingParamError_1.MissingParamError('stockName');
            if (initialDate.getTime() > finalDate.getTime())
                throw new InvalidRangeDate(initialDate, finalDate);
            const history = yield this.stockingAPI.fetchStockHistory(stockName, initialDate, finalDate);
            if (!history)
                throw new StockNotFound_1.StockNotFound(stockName);
            return history;
        });
    }
}
exports.GetStockHistoryUseCase = GetStockHistoryUseCase;
