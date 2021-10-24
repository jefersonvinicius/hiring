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
const Stock_1 = require("@app/core/entities/Stock");
const CompareStocks_1 = require("@app/core/use-cases/CompareStocks");
const helpers_1 = require("@app/__tests__/helpers");
const HttpRequest_1 = require("../HttpRequest");
const CompareStocksRoute_1 = require("./CompareStocksRoute");
describe('CompareStocksRoute', () => {
    it('should return correct model view', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, useCaseSpies } = createSut();
        useCaseSpies.execute.mockResolvedValue([
            new Stock_1.Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
            new Stock_1.Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }),
            new Stock_1.Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
        ]);
        const httpRequest = new HttpRequest_1.HttpRequest({
            params: { stockName: 'any' },
            body: { stocks: ['any 2', 'any 3'] },
        });
        const response = yield sut.handle(httpRequest);
        expect(useCaseSpies.execute).toHaveBeenCalledWith({ stockNames: ['any', 'any 2', 'any 3'] });
        expect(response.statusCode).toBe(200);
        const body = (0, helpers_1.parseViewModel)(response.body);
        expect(body).toMatchObject({
            lastPrices: [
                { name: 'any', lastPrice: 10, pricedAt: '2020-10-10' },
                { name: 'any 2', lastPrice: 11, pricedAt: '2020-10-11' },
                { name: 'any 3', lastPrice: 12, pricedAt: '2020-10-12' },
            ],
        });
    }));
    it('should return 400 status code when stocks to compare isn"t provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, useCaseSpies } = createSut();
        useCaseSpies.execute.mockResolvedValue([
            new Stock_1.Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
            new Stock_1.Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }),
            new Stock_1.Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
        ]);
        const httpRequest = new HttpRequest_1.HttpRequest({
            params: { stockName: 'any' },
        });
        const response = yield sut.handle(httpRequest);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            message: new CompareStocksRoute_1.InvalidStocksToCompareError().message,
        });
    }));
});
function createSut() {
    const stockingAPI = new FakeStockingAPI();
    const compareStocksUseCase = new CompareStocks_1.CompareStocksUseCase(stockingAPI);
    const executeSpy = jest.spyOn(compareStocksUseCase, 'execute');
    const sut = new CompareStocksRoute_1.CompareStocksRoute(compareStocksUseCase);
    return { sut, useCaseSpies: { execute: executeSpy } };
}
class FakeStockingAPI {
    fetchStockHistory(name, initialDate, finalDate) {
        throw new Error('Method not implemented.');
    }
    fetchByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
}
