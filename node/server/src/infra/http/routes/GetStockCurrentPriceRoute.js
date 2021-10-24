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
exports.GetStockCurrentPriceRoute = void 0;
const StockViewModel_1 = require("@app/presentation/StockViewModel");
const __1 = require("..");
const HttpResponse_1 = require("../HttpResponse");
class GetStockCurrentPriceRoute {
    constructor(getStockCurrentPriceUseCase) {
        this.getStockCurrentPriceUseCase = getStockCurrentPriceUseCase;
    }
    handle(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stock = yield this.getStockCurrentPriceUseCase.execute({
                    stockName: httpRequest.params.stockName,
                });
                return { statusCode: __1.HttpStatusCode.Ok, body: new StockViewModel_1.StockViewModel(stock) };
            }
            catch (error) {
                return HttpResponse_1.HttpResponseUtils.createErrorResponse(error);
            }
        });
    }
}
exports.GetStockCurrentPriceRoute = GetStockCurrentPriceRoute;
