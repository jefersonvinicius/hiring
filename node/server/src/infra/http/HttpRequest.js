"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
class HttpRequest {
    constructor(data) {
        var _a, _b, _c;
        this.body = (_a = data.body) !== null && _a !== void 0 ? _a : {};
        this.query = (_b = data.query) !== null && _b !== void 0 ? _b : {};
        this.params = (_c = data.params) !== null && _c !== void 0 ? _c : {};
    }
    static ofExpress(request) {
        return new HttpRequest({
            body: request.body,
            params: request.params,
            query: request.query,
        });
    }
}
exports.HttpRequest = HttpRequest;
