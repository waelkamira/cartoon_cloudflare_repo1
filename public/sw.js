/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/random-domain.js":
/*!*********************************!*\
  !*** ./public/random-domain.js ***!
  \*********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval(__webpack_require__.ts("// استيراد مكتبة Workbox لإدارة الـ service worker\nimportScripts(\"https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js\");\n// تحقق من توافر مكتبة workbox وأدرج الملفات المطلوبة في الخدمة\nif (workbox) {\n    workbox.precaching.precacheAndRoute([] || []);\n}\n// قائمة النطاقات العشوائية\nconst domains = [\n    \"https://cartoon-cloudflare-repo61.pages.dev/\",\n    \"https://cartoon-cloudflare-repo62.pages.dev/\",\n    \"https://cartoon-cloudflare-repo63.pages.dev/\",\n    \"https://cartoon-cloudflare-repo64.pages.dev/\"\n];\n// الاستماع لحدث 'fetch' لتوجيه الطلبات إلى نطاق عشوائي\nself.addEventListener(\"fetch\", (event)=>{\n    if (event.request.mode === \"navigate\") {\n        const randomDomain = domains[Math.floor(Math.random() * domains.length)];\n        const newUrl = randomDomain + new URL(event.request.url).pathname;\n        event.respondWith(fetch(newUrl).catch(()=>fetch(event.request)));\n    }\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wdWJsaWMvcmFuZG9tLWRvbWFpbi5qcyIsIm1hcHBpbmdzIjoiQUFBQSxrREFBa0Q7QUFDbERBLGNBQ0U7QUFHRiwrREFBK0Q7QUFDL0QsSUFBSUMsU0FBUztJQUNYQSxRQUFRQyxVQUFVLENBQUNDLGdCQUFnQixDQUFDQyxLQUFLQyxhQUFhLElBQUksRUFBRTtBQUM5RDtBQUVBLDJCQUEyQjtBQUMzQixNQUFNQyxVQUFVO0lBQ2Q7SUFDQTtJQUNBO0lBQ0E7Q0FDRDtBQUVELHVEQUF1RDtBQUN2REYsS0FBS0csZ0JBQWdCLENBQUMsU0FBUyxDQUFDQztJQUM5QixJQUFJQSxNQUFNQyxPQUFPLENBQUNDLElBQUksS0FBSyxZQUFZO1FBQ3JDLE1BQU1DLGVBQWVMLE9BQU8sQ0FBQ00sS0FBS0MsS0FBSyxDQUFDRCxLQUFLRSxNQUFNLEtBQUtSLFFBQVFTLE1BQU0sRUFBRTtRQUN4RSxNQUFNQyxTQUFTTCxlQUFlLElBQUlNLElBQUlULE1BQU1DLE9BQU8sQ0FBQ1MsR0FBRyxFQUFFQyxRQUFRO1FBRWpFWCxNQUFNWSxXQUFXLENBQUNDLE1BQU1MLFFBQVFNLEtBQUssQ0FBQyxJQUFNRCxNQUFNYixNQUFNQyxPQUFPO0lBQ2pFO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcHVibGljL3JhbmRvbS1kb21haW4uanM/M2E0NyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDYp9iz2KrZitix2KfYryDZhdmD2KrYqNipIFdvcmtib3gg2YTYpdiv2KfYsdipINin2YTZgCBzZXJ2aWNlIHdvcmtlclxyXG5pbXBvcnRTY3JpcHRzKFxyXG4gICdodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vd29ya2JveC1jZG4vcmVsZWFzZXMvNi4xLjUvd29ya2JveC1zdy5qcydcclxuKTtcclxuXHJcbi8vINiq2K3ZgtmCINmF2YYg2KrZiNin2YHYsSDZhdmD2KrYqNipIHdvcmtib3gg2YjYo9iv2LHYrCDYp9mE2YXZhNmB2KfYqiDYp9mE2YXYt9mE2YjYqNipINmB2Yog2KfZhNiu2K/ZhdipXHJcbmlmICh3b3JrYm94KSB7XHJcbiAgd29ya2JveC5wcmVjYWNoaW5nLnByZWNhY2hlQW5kUm91dGUoc2VsZi5fX1dCX01BTklGRVNUIHx8IFtdKTtcclxufVxyXG5cclxuLy8g2YLYp9im2YXYqSDYp9mE2YbYt9in2YLYp9iqINin2YTYudi02YjYp9im2YrYqVxyXG5jb25zdCBkb21haW5zID0gW1xyXG4gICdodHRwczovL2NhcnRvb24tY2xvdWRmbGFyZS1yZXBvNjEucGFnZXMuZGV2LycsXHJcbiAgJ2h0dHBzOi8vY2FydG9vbi1jbG91ZGZsYXJlLXJlcG82Mi5wYWdlcy5kZXYvJyxcclxuICAnaHR0cHM6Ly9jYXJ0b29uLWNsb3VkZmxhcmUtcmVwbzYzLnBhZ2VzLmRldi8nLFxyXG4gICdodHRwczovL2NhcnRvb24tY2xvdWRmbGFyZS1yZXBvNjQucGFnZXMuZGV2LycsXHJcbl07XHJcblxyXG4vLyDYp9mE2KfYs9iq2YXYp9i5INmE2K3Yr9irICdmZXRjaCcg2YTYqtmI2KzZitmHINin2YTYt9mE2KjYp9iqINil2YTZiSDZhti32KfZgiDYudi02YjYp9im2Ypcclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsIChldmVudCkgPT4ge1xyXG4gIGlmIChldmVudC5yZXF1ZXN0Lm1vZGUgPT09ICduYXZpZ2F0ZScpIHtcclxuICAgIGNvbnN0IHJhbmRvbURvbWFpbiA9IGRvbWFpbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZG9tYWlucy5sZW5ndGgpXTtcclxuICAgIGNvbnN0IG5ld1VybCA9IHJhbmRvbURvbWFpbiArIG5ldyBVUkwoZXZlbnQucmVxdWVzdC51cmwpLnBhdGhuYW1lO1xyXG5cclxuICAgIGV2ZW50LnJlc3BvbmRXaXRoKGZldGNoKG5ld1VybCkuY2F0Y2goKCkgPT4gZmV0Y2goZXZlbnQucmVxdWVzdCkpKTtcclxuICB9XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsiaW1wb3J0U2NyaXB0cyIsIndvcmtib3giLCJwcmVjYWNoaW5nIiwicHJlY2FjaGVBbmRSb3V0ZSIsInNlbGYiLCJfX1dCX01BTklGRVNUIiwiZG9tYWlucyIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInJlcXVlc3QiLCJtb2RlIiwicmFuZG9tRG9tYWluIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibGVuZ3RoIiwibmV3VXJsIiwiVVJMIiwidXJsIiwicGF0aG5hbWUiLCJyZXNwb25kV2l0aCIsImZldGNoIiwiY2F0Y2giXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./public/random-domain.js\n"));

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
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/random-domain.js");
/******/ 	
/******/ })()
;