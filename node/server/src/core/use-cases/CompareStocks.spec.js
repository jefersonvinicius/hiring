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
const Stock_1 = require("../entities/Stock");
const CompareStocks_1 = require("./CompareStocks");
describe('CompareStocksUseCase', () => {
    it('should return a list of stocks given their names', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        stockingAPISpies.fetchByName
            .mockResolvedValueOnce(new Stock_1.Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }))
            .mockResolvedValueOnce(new Stock_1.Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }))
            .mockResolvedValueOnce(new Stock_1.Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }));
        const stocks = yield sut.execute({
            stockNames: ['any', 'any 2', 'any 3'],
        });
        expect(stocks).toEqual([
            new Stock_1.Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
            new Stock_1.Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }),
            new Stock_1.Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
        ]);
    }));
    it('should remove of stocks result the stock names that not exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, stockingAPISpies } = createSut();
        stockingAPISpies.fetchByName
            .mockResolvedValueOnce(new Stock_1.Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }))
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(new Stock_1.Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }));
        const stocks = yield sut.execute({
            stockNames: ['any', 'any 2', 'any 3'],
        });
        expect(stocks).toEqual([
            new Stock_1.Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
            new Stock_1.Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
        ]);
    }));
});
function createSut() {
    const stockingAPI = new FakeStockingAPI();
    const fetchByName = jest.spyOn(stockingAPI, 'fetchByName');
    const sut = new CompareStocks_1.CompareStocksUseCase(stockingAPI);
    return { sut, stockingAPISpies: { fetchByName } };
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
