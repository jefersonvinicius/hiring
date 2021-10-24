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
exports.InvalidStocksToCompareError = exports.CompareStocksRoute = void 0;
const CompareStocksViewModel_1 = require("@app/presentation/CompareStocksViewModel");
const __1 = require("..");
const HttpResponse_1 = require("../HttpResponse");
class CompareStocksRoute {
    constructor(compareStocksUseCase) {
        this.compareStocksUseCase = compareStocksUseCase;
    }
    handle(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stocksToCompare = httpRequest.body.stocks;
                if (!stocksToCompare || stocksToCompare.length === 0)
                    throw new InvalidStocksToCompareError();
                const stockName = [httpRequest.params.stockName, ...stocksToCompare];
                const result = yield this.compareStocksUseCase.execute({ stockNames: stockName });
                return { statusCode: __1.HttpStatusCode.Ok, body: new CompareStocksViewModel_1.CompareStocksViewModel(result) };
            }
            catch (error) {
                return HttpResponse_1.HttpResponseUtils.createErrorResponse(error);
            }
        });
    }
}
exports.CompareStocksRoute = CompareStocksRoute;
class InvalidStocksToCompareError extends Error {
    constructor() {
        super('The stocks body field was not provided or was provided as empty array');
    }
}
exports.InvalidStocksToCompareError = InvalidStocksToCompareError;
