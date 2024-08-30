export var dynaError = function (errorArg) {
    if (typeof errorArg === "string") {
        return dynaErrorByIDynaError({ message: errorArg });
    }
    if (errorArg instanceof Error) {
        return dynaError({
            message: errorArg.message,
            stack: errorArg.stack,
        });
    }
    return dynaErrorByIDynaError(errorArg);
};
var dynaErrorByIDynaError = function (_a) {
    var message = _a.message, userMessage = _a.userMessage, code = _a.code, status = _a.status, data = _a.data, userData = _a.userData, parentError = _a.parentError, validationErrors = _a.validationErrors, canRetry = _a.canRetry, _b = _a.prefixMessageWithCode, prefixMessageWithCode = _b === void 0 ? false : _b;
    var fullMessage = [
        code !== undefined && prefixMessageWithCode
            ? "".concat(code, ":")
            : '',
        message,
    ]
        .filter(Boolean)
        .join(' ');
    var nError = new Error(fullMessage);
    return removeUndefined({
        date: new Date,
        name: 'Error',
        code: code,
        status: status,
        message: fullMessage,
        userMessage: userMessage,
        data: data,
        userData: userData,
        parentError: parentError,
        validationErrors: validationErrors,
        canRetry: canRetry,
        stack: nError.stack,
        isDynaError: true,
    });
};
var removeUndefined = function (data) {
    for (var key in data) {
        if (data[key] === undefined)
            delete data[key];
    }
    return data;
};
//# sourceMappingURL=dynaError.js.map