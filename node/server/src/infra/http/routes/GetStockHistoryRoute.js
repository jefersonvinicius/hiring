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
exports.GetStockHistoryRoute = void 0;
const StockHistoryViewModel_1 = require("@app/presentation/StockHistoryViewModel");
const __1 = require("..");
const MissingQueryParam_1 = require("../errors/MissingQueryParam");
const HttpResponse_1 = require("../HttpResponse");
class GetStockHistoryRoute {
    constructor(getStockHistoryUseCase) {
        this.getStockHistoryUseCase = getStockHistoryUseCase;
    }
    handle(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stockName = httpRequest.params.stockName;
                const { from, to } = httpRequest.query;
                if (!from)
                    throw new MissingQueryParam_1.MissingQueryParam('from');
                if (!to)
                    throw new MissingQueryParam_1.MissingQueryParam('to');
                const initialDate = new Date(from);
                const finalDate = new Date(to);
                const history = yield this.getStockHistoryUseCase.execute({
                    stockName,
                    initialDate,
                    finalDate,
                });
                return { statusCode: __1.HttpStatusCode.Ok, body: new StockHistoryViewModel_1.StockHistoryViewModel(history) };
            }
            catch (error) {
                return HttpResponse_1.HttpResponseUtils.createErrorResponse(error);
            }
        });
    }
}
exports.GetStockHistoryRoute = GetStockHistoryRoute;
