"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynaError = void 0;
var dynaError = function (messageOrErrorConfig) {
    return typeof messageOrErrorConfig === "string"
        ? dynaErrorByString(messageOrErrorConfig)
        : dynaErrorByObject(messageOrErrorConfig);
};
exports.dynaError = dynaError;
var dynaErrorByString = function (message) {
    return dynaErrorByObject({ message: message });
};
var dynaErrorByObject = function (_a) {
    var message = _a.message, userMessage = _a.userMessage, code = _a.code, status = _a.status, data = _a.data, parentError = _a.parentError, validationErrors = _a.validationErrors, canRetry = _a.canRetry;
    var error = new Error("".concat(code === undefined ? '' : "".concat(code, " ")).concat(message));
    error.date = new Date();
    error.userMessage = userMessage;
    error.code = code;
    error.status = status;
    error.data = data;
    error.parentError = parentError;
    error.validationErrors = validationErrors;
    error.canRetry = canRetry;
    error.isDynaError = true;
    return error;
};
//# sourceMappingURL=dynaError.js.map