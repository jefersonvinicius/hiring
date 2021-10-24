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
const MissingParamError_1 = require("@app/shared/errors/MissingParamError");
const Stock_1 = require("../entities/Stock");
const StockNotFound_1 = require("../errors/StockNotFound");
const GetStockCurrentPrice_1 = require("./GetStockCurrentPrice");
describe('GetStockCurrentPrice', () => {
    it('should fetch stock data on StockingAPI service', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        const stock = yield sut.execute({ stockName: 'any' });
        expect(stockingAPISpies.fetchByName).toHaveBeenCalledWith('any');
        expect(stock).toMatchObject({
            name: 'any',
            price: 49.5,
            pricedAt: new Date('2020-10-23T10:16:00.000Z'),
        });
    }));
    it('should returns price given the stock name', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        const stock = yield sut.execute({ stockName: 'any' });
        expect(stock).toMatchObject({
            name: 'any',
            price: 49.5,
            pricedAt: new Date('2020-10-23T10:16:00.000Z'),
        });
    }));
    it('should throw the MissingParamError when invalid stockName is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        let sutPromise = sut.execute({ stockName: '' });
        yield expect(sutPromise).rejects.toThrow(new MissingParamError_1.MissingParamError('stockName'));
        sutPromise = sut.execute({ stockName: ' ' });
        yield expect(sutPromise).rejects.toThrow(new MissingParamError_1.MissingParamError('stockName'));
    }));
    it('should throw the StockNotFound when stocking api returns null', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        stockingAPISpies.fetchByName.mockResolvedValue(null);
        const sutPromise = sut.execute({ stockName: 'any' });
        yield expect(sutPromise).rejects.toThrow(new StockNotFound_1.StockNotFound('any'));
    }));
});
function createSut() {
    const stockingAPI = new FakeStockingAPI();
    const stockingAPISpies = {
        fetchByName: jest.spyOn(stockingAPI, 'fetchByName'),
    };
    const sut = new GetStockCurrentPrice_1.GetStockCurrentPriceUseCase(stockingAPI);
    return { sut, stockingAPISpies };
}
class FakeStockingAPI {
    fetchStockHistory(name, initialDate, finalDate) {
        throw new Error('Method not implemented.');
    }
    fetchByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Stock_1.Stock({ name, price: 49.5, pricedAt: new Date('2020-10-23T10:16:00.000Z') });
        });
    }
}
