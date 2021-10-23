import { Stock } from "@app/core/entities/Stock";
import { Clock } from "@app/shared/Clock";
import {
  alphaVantageApi,
  AlphaVantageStockingAPI,
  APIKeyNotProvidedError,
} from "./AlphaVantageStockingAPI";

describe("AlphaVantageStockingAPI", () => {
  it('should throws an error if API key isn"t provided', () => {
    expect(() => {
      // @ts-ignore
      new AlphaVantageStockingAPI();
    }).toThrow(new APIKeyNotProvidedError());
  });

  describe("fetchByName", () => {
    it("should return an stock instance", async () => {
      const apiGetSpy = jest.spyOn(alphaVantageApi, "get").mockResolvedValue({
        data: {
          "Global Quote": {
            "01. symbol": "any_stock",
            "02. open": "128.0500",
            "03. high": "130.2500",
            "04. low": "126.6110",
            "05. price": "127.8800",
            "06. volume": "11582195",
            "07. latest trading day": "2021-10-22",
            "08. previous close": "128.3300",
            "09. change": "-0.4500",
            "10. change percent": "-0.3507%",
          },
        },
      });
      jest
        .spyOn(Clock, "now")
        .mockReturnValue(new Date("2022-10-22T10:00:00.000Z"));

      const sut = new AlphaVantageStockingAPI("any");
      const stock = await sut.fetchByName("any_stock");

      expect(apiGetSpy).toHaveBeenCalledWith(
        `/query?function=GLOBAL_QUOTE&symbol=any_stock&apikey=any`
      );
      expect(stock).toBeInstanceOf(Stock);
      expect(stock).toEqual({
        name: "any_stock",
        price: 127.88,
        pricedAt: new Date("2022-10-22T10:00:00.000Z"),
      });
    });
  });
});
