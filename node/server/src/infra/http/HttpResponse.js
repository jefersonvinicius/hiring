"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseUtils = void 0;
const StockNotFound_1 = require("@app/core/errors/StockNotFound");
const MissingParamError_1 = require("@app/shared/errors/MissingParamError");
const _1 = require(".");
const MissingQueryParam_1 = require("./errors/MissingQueryParam");
const CompareStocksRoute_1 = require("./routes/CompareStocksRoute");
class HttpResponseUtils {
    static createErrorResponse(error) {
        return {
            statusCode: getStatusCodeOf(error),
            body: (error === null || error === void 0 ? void 0 : error.message) && { message: error.message },
        };
    }
}
exports.HttpResponseUtils = HttpResponseUtils;
function getStatusCodeOf(error) {
    if (error instanceof MissingParamError_1.MissingParamError)
        return _1.HttpStatusCode.BadRequest;
    if (error instanceof StockNotFound_1.StockNotFound)
        return _1.HttpStatusCode.NotFound;
    if (error instanceof MissingQueryParam_1.MissingQueryParam)
        return _1.HttpStatusCode.BadRequest;
    if (error instanceof CompareStocksRoute_1.InvalidStocksToCompareError)
        return _1.HttpStatusCode.BadRequest;
    return _1.HttpStatusCode.ServerError;
}
