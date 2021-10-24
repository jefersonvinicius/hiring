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
const StockNotFound_1 = require("@app/core/errors/StockNotFound");
const GainsStocks_1 = require("@app/core/use-cases/GainsStocks");
const helpers_1 = require("@app/__tests__/helpers");
const __1 = require("..");
const MissingQueryParam_1 = require("../errors/MissingQueryParam");
const HttpRequest_1 = require("../HttpRequest");
const StockGainsRoute_1 = require("./StockGainsRoute");
describe('StockGainsRoute', () => {
    it('should return model view correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, useCaseSpies } = createSut();
        useCaseSpies.execute.mockResolvedValue({
            name: 'any',
            purchasedAmount: 100,
            purchasedAt: new Date('2021-10-22'),
            priceAtDate: 142.36,
            lastPrice: 127.88,
            capitalGains: -1448.0000000000018,
        });
        const request = new HttpRequest_1.HttpRequest({
            params: { stockName: 'Any' },
            query: { purchasedAt: '2021-10-22', purchasedAmount: '100' },
        });
        const response = yield sut.handle(request);
        expect(useCaseSpies.execute).toHaveBeenCalledWith({
            stockName: 'Any',
            purchasedAt: new Date('2021-10-22'),
            purchasedAmount: 100,
        });
        expect(response.statusCode).toBe(__1.HttpStatusCode.Ok);
        expect((0, helpers_1.parseViewModel)(response.body)).toEqual({
            name: 'any',
            purchasedAmount: 100,
            purchasedAt: '2021-10-22',
            priceAtDate: 142.36,
            lastPrice: 127.88,
            capitalGains: -1448.0000000000018,
        });
    }));
    it('should return 404 when stock name isn"t found', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, useCaseSpies } = createSut();
        useCaseSpies.execute.mockRejectedValue(new StockNotFound_1.StockNotFound('Any'));
        const request = new HttpRequest_1.HttpRequest({
            params: { stockName: 'Any' },
            query: { purchasedAt: '2021-10-22', purchasedAmount: 100 },
        });
        const response = yield sut.handle(request);
        expect(response.statusCode).toBe(__1.HttpStatusCode.NotFound);
        expect(response.body).toEqual({
            message: new StockNotFound_1.StockNotFound('Any').message,
        });
    }));
    it('should returns 400 status code when some query param is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        let request = new HttpRequest_1.HttpRequest({
            params: { stockName: 'Any' },
            query: {},
        });
        let response = yield sut.handle(request);
        expect(response.statusCode).toBe(__1.HttpStatusCode.BadRequest);
        expect(response.body).toEqual({
            message: new MissingQueryParam_1.MissingQueryParam('purchasedAt').message,
        });
        request = new HttpRequest_1.HttpRequest({
            params: { stockName: 'Any' },
            query: { purchasedAt: '2021-10-21' },
        });
        response = yield sut.handle(request);
        expect(response.statusCode).toBe(__1.HttpStatusCode.BadRequest);
        expect(response.body).toEqual({
            message: new MissingQueryParam_1.MissingQueryParam('purchasedAmount').message,
        });
    }));
});
function createSut() {
    const stockingAPI = new FakeStockingAPI();
    const gainsStockUseCase = new GainsStocks_1.GainsStocksUseCase(stockingAPI);
    const executeSpy = jest.spyOn(gainsStockUseCase, 'execute');
    const sut = new StockGainsRoute_1.StockGainsRoute(gainsStockUseCase);
    return { sut, useCaseSpies: { execute: executeSpy } };
}
class FakeStockingAPI {
    fetchByName(name) {
        throw new Error('Method not implemented.');
    }
    fetchStockHistory(name, initialDate, finalDate) {
        throw new Error('Method not implemented.');
    }
}
