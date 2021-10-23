import { MissingParamError } from '@app/shared/errors/MissingParamError';
import { HttpStatusCode } from '.';

type ErrorResponse = { message: string };

export type HttpResponse<Body = any> = {
  statusCode: number;
  body: Body | ErrorResponse | undefined;
};

export class HttpResponseUtils {
  static createErrorResponse(error: any): HttpResponse {
    return {
      statusCode: getStatusCodeOf(error),
      body: error?.message && { message: error.message },
    };
  }
}

function getStatusCodeOf(error: any) {
  console.log('Error:', error);
  if (error instanceof MissingParamError) return HttpStatusCode.BadRequest;
  return HttpStatusCode.ServerError;
}
