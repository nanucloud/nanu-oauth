"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomErrorResponse = /** @class */ (function () {
    function CustomErrorResponse() {
    }
    CustomErrorResponse.response = function (code, message, res) {
        res.status(code).json({
            error: message
        });
    };
    return CustomErrorResponse;
}());
exports.default = CustomErrorResponse;
