import * as tslib_1 from "tslib";
/**
 * 执行中间件流程
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @param {T} [context] 上下文对象
 * @returns {Promise<P>}
 */
export function runMiddlewares(middlewares, context, outNext) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var curIndex, promises, next;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 处理middlewares异常
                    middlewares = (middlewares || []).filter(function (middleware) { return middleware != null; });
                    curIndex = -1;
                    promises = [];
                    next = function () {
                        var tempIndex = ++curIndex;
                        var promise = new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var result, middleware, curResult, nextResult, err_1;
                            var _this = this;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 7, , 8]);
                                        if (!(curIndex >= middlewares.length)) return [3 /*break*/, 3];
                                        result = void 0;
                                        if (!outNext) return [3 /*break*/, 2];
                                        return [4 /*yield*/, outNext()];
                                    case 1:
                                        result = _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        // 结束流程
                                        resolve(result);
                                        return [3 /*break*/, 6];
                                    case 3:
                                        middleware = middlewares[curIndex];
                                        return [4 /*yield*/, middleware(context, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                return tslib_1.__generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!(curIndex === tempIndex)) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, next()];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                        case 2: return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 4:
                                        curResult = _a.sent();
                                        // 确保next被调用过
                                        if (curIndex === tempIndex) {
                                            next();
                                        }
                                        return [4 /*yield*/, promises[tempIndex + 1]];
                                    case 5:
                                        nextResult = _a.sent();
                                        // 优先返回当前的result，如果当前没有返回，则返回下一个中间件的返回值
                                        resolve(curResult !== undefined ? curResult : nextResult);
                                        _a.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        err_1 = _a.sent();
                                        reject(err_1);
                                        return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); });
                        promises[tempIndex] = promise;
                        return promise;
                    };
                    return [4 /*yield*/, next()];
                case 1: 
                // 执行第一轮
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 合并包装一个中间件执行方法
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>} 中间件执行方法，只需传入上下文对象即可
 */
export function combineMiddlewares(middlewares) {
    // 处理middlewares异常
    middlewares = (middlewares || []).filter(function (middleware) { return middleware != null; });
    var middleware = function (context, next) {
        return runMiddlewares(middlewares, context, next);
    };
    middleware["subMiddlewares"] = middlewares;
    return middleware;
}
/**
 * 将所有中间件打平
 *
 * @author Raykid
 * @date 2019-06-18
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>[]}
 */
export function flattenMiddlewares(middlewares) {
    // 处理middlewares异常
    middlewares = (middlewares || []).filter(function (middleware) { return middleware != null; });
    var flatList = [];
    for (var _i = 0, middlewares_1 = middlewares; _i < middlewares_1.length; _i++) {
        var middleware = middlewares_1[_i];
        var subMiddlewares = middleware["subMiddlewares"];
        if (subMiddlewares) {
            flatList.push.apply(flatList, flattenMiddlewares(subMiddlewares));
        }
        else {
            flatList.push(middleware);
        }
    }
    return flatList;
}
/**
 * 将所有中间件打平并合并成一个中间件执行器
 *
 * @author Raykid
 * @date 2019-06-18
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>}
 */
export function flattenCombineMiddlewares(middlewares) {
    return combineMiddlewares(flattenMiddlewares(middlewares));
}
