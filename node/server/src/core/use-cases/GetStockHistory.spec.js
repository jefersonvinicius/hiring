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
const StockNotFound_1 = require("../errors/StockNotFound");
const GetStockHistory_1 = require("./GetStockHistory");
describe('GetStockHistory', () => {
    it('should calls StockingAPI to fetch history', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        const stockHistory = yield sut.execute({
            stockName: 'any',
            initialDate: new Date('2020-10-23T10:00:00.000Z'),
            finalDate: new Date('2020-10-23T14:00:00.000Z'),
        });
        expect(stockingAPISpies.fetchStockHistory).toHaveBeenCalledWith('any', new Date('2020-10-23T10:00:00.000Z'), new Date('2020-10-23T14:00:00.000Z'));
        expect(stockHistory).toMatchObject({
            stock: { name: 'any', price: 10, pricedAt: new Date('2020-10-21T13:00:00.000Z') },
            history: [
                { closing: 100, opening: 80, high: 110, low: 79, pricedAt: new Date('2020-10-21T10:00:00.000Z') },
                { closing: 110, opening: 70, high: 120, low: 50, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
                { closing: 120, opening: 40, high: 130, low: 80, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
            ],
        });
    }));
    it('should throw an error when final date is before than initial date', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = createSut();
        const initialDate = new Date('2020-10-23T14:00:00.000Z');
        const finalDate = new Date('2020-10-23T10:00:00.000Z');
        const sutPromise = sut.execute({
            stockName: 'any',
            initialDate,
            finalDate,
        });
        yield expect(sutPromise).rejects.toThrow(new GetStockHistory_1.InvalidRangeDate(initialDate, finalDate));
    }));
    it('should throw the StockNotFound when stocking api returns null', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        stockingAPISpies.fetchStockHistory.mockResolvedValue(null);
        const sutPromise = sut.execute({
            stockName: 'invalid',
            initialDate: new Date('2020-10-23T10:00:00.000Z'),
            finalDate: new Date('2020-10-23T14:00:00.000Z'),
        });
        yield expect(sutPromise).rejects.toThrow(new StockNotFound_1.StockNotFound('invalid'));
    }));
});
function createSut() {
    const stockingAPI = new FakeStockingAPI();
    const stockingAPISpies = {
        fetchStockHistory: jest.spyOn(stockingAPI, 'fetchStockHistory'),
    };
    const sut = new GetStockHistory_1.GetStockHistoryUseCase(stockingAPI);
    return { sut, stockingAPISpies };
}
class FakeStockingAPI {
    fetchStockHistory(name, initialDate, finalDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                stock: { name: name, price: 10, pricedAt: new Date('2020-10-21T13:00:00.000Z') },
                history: [
                    { closing: 100, opening: 80, high: 110, low: 79, pricedAt: new Date('2020-10-21T10:00:00.000Z') },
                    { closing: 110, opening: 70, high: 120, low: 50, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
                    { closing: 120, opening: 40, high: 130, low: 80, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
                ],
            };
        });
    }
    fetchByName(name) {
        throw new Error('Method not implemented.');
    }
}
