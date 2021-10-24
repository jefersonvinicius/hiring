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
exports.StockGainsRoute = void 0;
const StockGainsViewModel_1 = require("@app/presentation/StockGainsViewModel");
const __1 = require("..");
const MissingQueryParam_1 = require("../errors/MissingQueryParam");
const HttpResponse_1 = require("../HttpResponse");
class StockGainsRoute {
    constructor(stockGainsUseCase) {
        this.stockGainsUseCase = stockGainsUseCase;
    }
    handle(httpRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { purchasedAt, purchasedAmount } = (_a = httpRequest.query) !== null && _a !== void 0 ? _a : {};
                if (!purchasedAt)
                    throw new MissingQueryParam_1.MissingQueryParam('purchasedAt');
                if (!purchasedAmount)
                    throw new MissingQueryParam_1.MissingQueryParam('purchasedAmount');
                const stockGains = yield this.stockGainsUseCase.execute({
                    purchasedAmount: Number(purchasedAmount),
                    purchasedAt: new Date(purchasedAt),
                    stockName: httpRequest.params.stockName,
                });
                return { statusCode: __1.HttpStatusCode.Ok, body: new StockGainsViewModel_1.StockGainsViewModel(stockGains) };
            }
            catch (error) {
                return HttpResponse_1.HttpResponseUtils.createErrorResponse(error);
            }
        });
    }
}
exports.StockGainsRoute = StockGainsRoute;
