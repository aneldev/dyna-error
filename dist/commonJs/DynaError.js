"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynaError = void 0;
var dynaError = function (_a) {
    var message = _a.message, userMessage = _a.userMessage, code = _a.code, status = _a.status, data = _a.data, canRetry = _a.canRetry;
    var error = new Error(message);
    error.date = new Date();
    error.userMessage = userMessage;
    error.code = code;
    error.status = status;
    error.data = data;
    error.canRetry = canRetry;
    error.isDynaError = true;
    return error;
};
exports.dynaError = dynaError;
//# sourceMappingURL=dynaError.js.map