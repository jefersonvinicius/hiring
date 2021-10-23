import { GetStockCurrentPriceUseCase } from '@app/core/use-cases/GetStockCurrentPrice';
import { GetStockHistoryUseCase } from '@app/core/use-cases/GetStockHistory';
import { StockHistoryViewModel } from '@app/presentation/StockHistoryViewModel';
import { StockViewModel } from '@app/presentation/StockViewModel';
import { Route } from '.';
import { HttpStatusCode } from '..';
import { HttpRequest } from '../HttpRequest';
import { HttpResponse, HttpResponseUtils } from '../HttpResponse';

export class GetStockHistoryRoute implements Route<StockHistoryViewModel> {
  constructor(private getStockHistoryUseCase: GetStockHistoryUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<StockHistoryViewModel>> {
    try {
      const stockName = httpRequest.params.stockName;
      const initialDate = new Date(httpRequest.query.from);
      const finalDate = new Date(httpRequest.query.to);

      const history = await this.getStockHistoryUseCase.execute({
        stockName,
        initialDate,
        finalDate,
      });

      return { statusCode: HttpStatusCode.Ok, body: new StockHistoryViewModel(history) };
    } catch (error) {
      return HttpResponseUtils.createErrorResponse(error);
    }
  }
}
