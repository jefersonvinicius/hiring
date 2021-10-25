import { StockingAPI, StockNotFoundError, stockingAPIInstance } from './StockingAPI';

describe('StockingAPI', () => {
  let getApiSpy: jest.SpyInstance;

  beforeEach(() => {
    getApiSpy = jest.spyOn(stockingAPIInstance, 'get').mockImplementation();
  });

  describe('fetchQuote', () => {
    it('should throws StockNotFound when axios return 404 status code', async () => {
      getApiSpy.mockRejectedValue({
        response: { status: 404 },
      });
      const sut = StockingAPI.fetchQuote('any');
      await expect(sut).rejects.toThrow(new StockNotFoundError('any'));
    });
  });
});
