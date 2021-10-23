import { HttpRequest } from '../HttpRequest';
import { HttpResponse } from '../HttpResponse';

export interface Route<Response = undefined> {
  handle(httpRequest: HttpRequest): Promise<HttpResponse<Response>>;
}
