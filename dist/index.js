(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dyna-error", [], factory);
	else if(typeof exports === 'object')
		exports["dyna-error"] = factory();
	else
		root["dyna-error"] = factory();
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dynaError.ts":
/*!**************************!*\
  !*** ./src/dynaError.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dynaError: () => (/* binding */ _dynaError)
/* harmony export */ });
var _dynaError = function dynaError(errorArg) {
  if (typeof errorArg === "string") {
    return dynaErrorByIDynaError({
      message: errorArg
    });
  }
  if (errorArg instanceof Error) {
    return _dynaError({
      message: errorArg.message,
      _applyStackContent: errorArg.stack
    });
  }
  if (errorArg && (errorArg === null || errorArg === void 0 ? void 0 : errorArg.message)) {
    return dynaErrorByIDynaError(errorArg);
  }
  // This is a case of something strage unknown
  return _dynaError({
    message: "Unknown nature of error",
    parentError: {
      error: errorArg
    }
  });
};

var dynaErrorByIDynaError = function dynaErrorByIDynaError(_ref) {
  var message = _ref.message,
    userMessage = _ref.userMessage,
    code = _ref.code,
    status = _ref.status,
    data = _ref.data,
    userData = _ref.userData,
    parentError = _ref.parentError,
    validationErrors = _ref.validationErrors,
    _ref$stack = _ref.stack,
    stack = _ref$stack === void 0 ? true : _ref$stack,
    _applyStackContent = _ref._applyStackContent,
    canRetry = _ref.canRetry,
    _ref$prefixMessageWit = _ref.prefixMessageWithCode,
    prefixMessageWithCode = _ref$prefixMessageWit === void 0 ? false : _ref$prefixMessageWit;
  var fullMessage = [code !== undefined && prefixMessageWithCode ? "".concat(code, ":") : '', message].filter(Boolean).join(' ');
  return removeUndefined({
    date: new Date(),
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
    stack: _applyStackContent ? _applyStackContent : stack ? new Error(fullMessage).stack : undefined,
    isDynaError: true
  });
};
var removeUndefined = function removeUndefined(data) {
  for (var key in data) {
    if (data[key] === undefined) delete data[key];
  }
  return data;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dynaError: () => (/* reexport safe */ _dynaError__WEBPACK_IMPORTED_MODULE_0__.dynaError)
/* harmony export */ });
/* harmony import */ var _dynaError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dynaError */ "./src/dynaError.ts");

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map