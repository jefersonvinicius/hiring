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
const HistoryPrice_1 = require("@app/core/entities/HistoryPrice");
const StockNotFound_1 = require("@app/core/errors/StockNotFound");
const GetStockHistory_1 = require("@app/core/use-cases/GetStockHistory");
const StockHistoryViewModel_1 = require("@app/presentation/StockHistoryViewModel");
const MissingParamError_1 = require("@app/shared/errors/MissingParamError");
const helpers_1 = require("@app/__tests__/helpers");
const __1 = require("..");
const MissingQueryParam_1 = require("../errors/MissingQueryParam");
const HttpRequest_1 = require("../HttpRequest");
const GetStockHistoryRoute_1 = require("./GetStockHistoryRoute");
describe('GetStockHistoryRoute', () => {
    it('should returns a stock view model when is a stock name valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        const request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: 'any',
            },
            query: {
                from: '2020-09-10',
                to: '2020-10-10',
            },
        });
        const response = yield sut.handle(request);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(StockHistoryViewModel_1.StockHistoryViewModel);
        const parsed = (0, helpers_1.parseViewModel)(response.body);
        expect(parsed).toMatchObject({
            name: 'any',
            prices: expectedHistory(),
        });
    }));
    it('should returns 404 status code when stock information isn"t found', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        stockingAPISpies.fetchByName.mockResolvedValue(null);
        const request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: 'invalid',
            },
            query: {
                from: '2020-09-10',
                to: '2020-10-10',
            },
        });
        const response = yield sut.handle(request);
        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({ message: new StockNotFound_1.StockNotFound('invalid').message });
    }));
    it('should returns a 400 when invalid stock name is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        const request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: ' ',
            },
            query: {
                from: '2020-09-10',
                to: '2020-10-10',
            },
        });
        const response = yield sut.handle(request);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({ message: new MissingParamError_1.MissingParamError('stockName').message });
    }));
    it('should throws the MissingQueryParam when "to" or "from" are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        let request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: 'any',
            },
        });
        let response = yield sut.handle(request);
        expect(response.statusCode).toBe(__1.HttpStatusCode.BadRequest);
        expect(response.body).toMatchObject({
            message: new MissingQueryParam_1.MissingQueryParam('from').message,
        });
        request = new HttpRequest_1.HttpRequest({
            params: {
                stockName: 'any',
            },
            query: {
                from: '2020-10-22',
            },
        });
        response = yield sut.handle(request);
        expect(response.statusCode).toBe(__1.HttpStatusCode.BadRequest);
        expect(response.body).toMatchObject({
            message: new MissingQueryParam_1.MissingQueryParam('to').message,
        });
    }));
});
function createSut() {
    const stockingAPI = new FakeStockingAPI();
    const getStockHistoryUseCase = new GetStockHistory_1.GetStockHistoryUseCase(stockingAPI);
    const sut = new GetStockHistoryRoute_1.GetStockHistoryRoute(getStockHistoryUseCase);
    const stockingAPISpies = {
        fetchByName: jest.spyOn(stockingAPI, 'fetchStockHistory'),
    };
    return { sut, stockingAPISpies };
}
class FakeStockingAPI {
    fetchByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    fetchStockHistory(name, initialDate, finalDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                stockName: name,
                history: fakeHistoryData(),
            };
        });
    }
}
function fakeHistoryData() {
    return [
        new HistoryPrice_1.HistoryPrice({
            closing: 100,
            opening: 80,
            high: 110,
            low: 79,
            pricedAt: new Date('2020-10-21T10:00:00.000Z'),
        }),
        new HistoryPrice_1.HistoryPrice({
            closing: 110,
            opening: 70,
            high: 120,
            low: 50,
            pricedAt: new Date('2020-10-22T10:00:00.000Z'),
        }),
        new HistoryPrice_1.HistoryPrice({
            closing: 120,
            opening: 40,
            high: 130,
            low: 80,
            pricedAt: new Date('2020-10-22T10:00:00.000Z'),
        }),
    ];
}
function expectedHistory() {
    return [
        {
            closing: 100,
            opening: 80,
            high: 110,
            low: 79,
            pricedAt: '2020-10-21',
        },
        {
            closing: 110,
            opening: 70,
            high: 120,
            low: 50,
            pricedAt: '2020-10-22',
        },
        {
            closing: 120,
            opening: 40,
            high: 130,
            low: 80,
            pricedAt: '2020-10-22',
        },
    ];
}
