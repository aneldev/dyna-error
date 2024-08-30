export var dynaError = function (errorArg) {
    if (typeof errorArg === "string") {
        return dynaErrorByIDynaError({ message: errorArg });
    }
    if (errorArg instanceof Error) {
        return dynaError({
            message: errorArg.message,
            _applyStackContent: errorArg.stack,
        });
    }
    if (errorArg && (errorArg === null || errorArg === void 0 ? void 0 : errorArg.message)) {
        return dynaErrorByIDynaError(errorArg);
    }
    // This is a case of something strage unknown
    return dynaError({
        message: "Unknown nature of error",
        parentError: { error: errorArg },
    });
};
var dynaErrorByIDynaError = function (_a) {
    var message = _a.message, userMessage = _a.userMessage, code = _a.code, status = _a.status, data = _a.data, userData = _a.userData, parentError = _a.parentError, validationErrors = _a.validationErrors, _b = _a.stack, stack = _b === void 0 ? true : _b, _applyStackContent = _a._applyStackContent, canRetry = _a.canRetry, _c = _a.prefixMessageWithCode, prefixMessageWithCode = _c === void 0 ? false : _c;
    var fullMessage = [
        code !== undefined && prefixMessageWithCode
            ? "".concat(code, ":")
            : '',
        message,
    ]
        .filter(Boolean)
        .join(' ');
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
        stack: _applyStackContent
            ? _applyStackContent
            : stack
                ? new Error(fullMessage).stack
                : undefined,
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