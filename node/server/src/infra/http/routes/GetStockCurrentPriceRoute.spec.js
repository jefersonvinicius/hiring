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
const StockNotFound_1 = require("@app/core/errors/StockNotFound");
const GetStockCurrentPrice_1 = require("@app/core/use-cases/GetStockCurrentPrice");
const StockViewModel_1 = require("@app/presentation/StockViewModel");
const MissingParamError_1 = require("@app/shared/errors/MissingParamError");
const helpers_1 = require("@app/__tests__/helpers");
const HttpRequest_1 = require("../HttpRequest");
const GetStockCurrentPriceRoute_1 = require("./GetStockCurrentPriceRoute");
describe('GetStockCurrentPriceRoute', () => {
    it('should returns a stock view model when is a stock name valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        const request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: 'any',
            },
        });
        const response = yield sut.handle(request);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(StockViewModel_1.StockViewModel);
        const parsed = (0, helpers_1.parseViewModel)(response.body);
        expect(parsed).toMatchObject({
            name: 'any',
            lastPrice: 50,
            pricedAt: '2021-10-22',
        });
    }));
    it('should returns a 400 when invalid stock name is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        const request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: ' ',
            },
        });
        const response = yield sut.handle(request);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({ message: new MissingParamError_1.MissingParamError('stockName').message });
    }));
    it('should returns 404 status code when stock information isn"t found', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        stockingAPISpies.fetchByName.mockResolvedValue(null);
        const request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: 'invalid',
            },
        });
        const response = yield sut.handle(request);
        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({ message: new StockNotFound_1.StockNotFound('invalid').message });
    }));
});
function createSut() {
    const stockingAPI = new FakeStockingAPI();
    const getCurrentPriceUseCase = new GetStockCurrentPrice_1.GetStockCurrentPriceUseCase(stockingAPI);
    const sut = new GetStockCurrentPriceRoute_1.GetStockCurrentPriceRoute(getCurrentPriceUseCase);
    const stockingAPISpies = {
        fetchByName: jest.spyOn(stockingAPI, 'fetchByName'),
    };
    return { sut, stockingAPISpies };
}
function createFakeStock(name) {
    return new Stock_1.Stock({ name, price: 50, pricedAt: new Date('2021-10-22T10:10:00.000Z') });
}
class FakeStockingAPI {
    fetchByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return createFakeStock(name);
        });
    }
    fetchStockHistory(name, initialDate, finalDate) {
        throw new Error('Method not implemented.');
    }
}
