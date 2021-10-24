"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingQueryParam = void 0;
class MissingQueryParam extends Error {
    constructor(queryParam) {
        super(`Missing query param: ${queryParam}`);
    }
}
exports.MissingQueryParam = MissingQueryParam;
