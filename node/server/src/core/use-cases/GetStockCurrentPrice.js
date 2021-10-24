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
exports.GetStockCurrentPriceUseCase = void 0;
const MissingParamError_1 = require("@app/shared/errors/MissingParamError");
const StockNotFound_1 = require("../errors/StockNotFound");
class GetStockCurrentPriceUseCase {
    constructor(stockingAPI) {
        this.stockingAPI = stockingAPI;
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.stockName || !params.stockName.trim())
                throw new MissingParamError_1.MissingParamError('stockName');
            const stock = yield this.stockingAPI.fetchByName(params.stockName);
            if (!stock)
                throw new StockNotFound_1.StockNotFound(params.stockName);
            return stock;
        });
    }
}
exports.GetStockCurrentPriceUseCase = GetStockCurrentPriceUseCase;
