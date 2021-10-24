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
const CompareStocks_1 = require("@app/core/use-cases/CompareStocks");
const GainsStocks_1 = require("@app/core/use-cases/GainsStocks");
const GetStockCurrentPrice_1 = require("@app/core/use-cases/GetStockCurrentPrice");
const GetStockHistory_1 = require("@app/core/use-cases/GetStockHistory");
const HttpRequest_1 = require("@app/infra/http/HttpRequest");
const CompareStocksRoute_1 = require("@app/infra/http/routes/CompareStocksRoute");
const GetStockCurrentPriceRoute_1 = require("@app/infra/http/routes/GetStockCurrentPriceRoute");
const GetStockHistoryRoute_1 = require("@app/infra/http/routes/GetStockHistoryRoute");
const StockGainsRoute_1 = require("@app/infra/http/routes/StockGainsRoute");
const AlphaVantageStockingAPI_1 = require("@app/services/AlphaVantageStockingAPI");
const express_1 = require("express");
const router = (0, express_1.Router)();
const stockingAPI = new AlphaVantageStockingAPI_1.AlphaVantageStockingAPI(process.env.API_KEY);
const getStockCurrentPriceUseCase = new GetStockCurrentPrice_1.GetStockCurrentPriceUseCase(stockingAPI);
const getStockCurrentPriceRoute = new GetStockCurrentPriceRoute_1.GetStockCurrentPriceRoute(getStockCurrentPriceUseCase);
const getStockHistoryUseCase = new GetStockHistory_1.GetStockHistoryUseCase(stockingAPI);
const getStockHistoryRoute = new GetStockHistoryRoute_1.GetStockHistoryRoute(getStockHistoryUseCase);
const compareStocksUseCase = new CompareStocks_1.CompareStocksUseCase(stockingAPI);
const compareStocksRoute = new CompareStocksRoute_1.CompareStocksRoute(compareStocksUseCase);
const stockGainsUseCase = new GainsStocks_1.GainsStocksUseCase(stockingAPI);
const stockGainsRoute = new StockGainsRoute_1.StockGainsRoute(stockGainsUseCase);
router.get('/stock/:stockName/quote', adaptToRoute(getStockCurrentPriceRoute));
router.get('/stocks/:stockName/history', adaptToRoute(getStockHistoryRoute));
router.get('/stocks/:stockName/compare', adaptToRoute(compareStocksRoute));
router.get('/stocks/:stockName/gains', adaptToRoute(stockGainsRoute));
exports.default = router;
function adaptToRoute(route) {
    return (request, response) => __awaiter(this, void 0, void 0, function* () {
        const routeResponse = yield route.handle(HttpRequest_1.HttpRequest.ofExpress(request));
        return response.status(routeResponse.statusCode).json(routeResponse.body);
    });
}
