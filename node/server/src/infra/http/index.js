"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["Ok"] = 200] = "Ok";
    HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
    HttpStatusCode[HttpStatusCode["ServerError"] = 500] = "ServerError";
    HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
