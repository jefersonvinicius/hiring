import { GetStockCurrentPriceUseCase } from "@app/core/use-cases/GetStockCurrentPrice";
import { HttpRequest } from "@app/infra/http/HttpRequest";
import { Route } from "@app/infra/http/routes";
import { GetStockCurrentPriceRoute } from "@app/infra/http/routes/GetStockCurrentPriceRoute";
import { AlphaVantageStockingAPI } from "@app/services/AlphaVantageStockingAPI";
import { Request, Response, Router } from "express";

const router = Router();

const stockingAPI = new AlphaVantageStockingAPI(process.env.API_KEY);
const getStockCurrentPriceUseCase = new GetStockCurrentPriceUseCase(stockingAPI);
const getStockCurrentPriceRoute = new GetStockCurrentPriceRoute(getStockCurrentPriceUseCase);

router.get("/stock/:stockName/quote", adaptToRoute(getStockCurrentPriceRoute));

export default router;

function adaptToRoute(route: Route) {
  return async (request: Request, response: Response) => {
    const routeResponse = await route.handle(HttpRequest.ofExpress(request));
    return response.status(routeResponse.statusCode).json(routeResponse.body);
  };
}
