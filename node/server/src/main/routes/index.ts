import { Stock } from '@app/core/entities/Stock';
import { GetStockCurrentPriceUseCase } from '@app/core/use-cases/GetStockCurrentPrice';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { HttpRequest } from '@app/infra/http/HttpRequest';
import { Route } from '@app/infra/http/routes';
import { GetStockCurrentPriceRoute } from '@app/infra/http/routes/GetStockCurrentPriceRoute';
import { StockingAPI } from '@app/services/StockingAPI';
import { Request, Response, Router } from 'express';

const router = Router();

class FakeStockingAPI implements StockingAPI {
  async fetchByName(name: string): Promise<Stock> {
    return new Stock({
      name: name,
      price: 50,
      pricedAt: new Date('2021-10-28T10:10:10.000Z'),
    });
  }

  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    throw new Error('Method not implemented.');
  }
}

const stockingAPI = new FakeStockingAPI();
const getStockCurrentPriceUseCase = new GetStockCurrentPriceUseCase(stockingAPI);
const getStockCurrentPriceRoute = new GetStockCurrentPriceRoute(getStockCurrentPriceUseCase);

router.get('/stock/:stockName/quote', adaptToRoute(getStockCurrentPriceRoute));

export default router;

function adaptToRoute(route: Route) {
  return async (request: Request, response: Response) => {
    const routeResponse = await route.handle(HttpRequest.ofExpress(request));
    return response.status(routeResponse.statusCode).json(routeResponse.body);
  };
}
