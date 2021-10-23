export class HttpRequest<Body = any, Query = any, Params = any> {
  public body?: Body;
  public query?: Query;
  public params?: Params;

  constructor(data: { body?: Body; query?: Query; params?: Params }) {
    this.body = data.body;
    this.query = data.query;
    this.params = data.params;
  }
}
