import { CompareStocksUseCase } from '@app/core/use-cases/CompareStocks';
import { CompareStocksViewModel } from '@app/presentation/CompareStocksViewModel';
import { Route } from '.';
import { HttpStatusCode } from '..';
import { HttpRequest } from '../HttpRequest';
import { HttpResponse } from '../HttpResponse';

export class CompareStocksRoute implements Route<CompareStocksViewModel> {
  constructor(private compareStocksUseCase: CompareStocksUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<CompareStocksViewModel>> {
    const stockName = [httpRequest.params.stockName, ...httpRequest.body.stocks];
    const result = await this.compareStocksUseCase.execute({ stockNames: stockName });
    return { statusCode: HttpStatusCode.Ok, body: new CompareStocksViewModel(result) };
  }
}
