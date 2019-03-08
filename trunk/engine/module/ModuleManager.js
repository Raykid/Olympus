import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { getConstructor } from "../../utils/ConstructUtil";
import { ModuleOpenStatus } from "../mediator/IMediatorModulePart";
import { getModule } from "../mediator/Mediator";
import ModuleMessage from "./ModuleMessage";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-15
 *
 * 模块管理器，管理模块相关的所有操作。模块具有唯一性，同一时间不可以打开两个相同模块，如果打开则会退回到先前的模块处
*/
var ModuleManager = /** @class */ (function () {
    function ModuleManager() {
        this._moduleStack = [];
        this._openCache = [];
        this._opening = null;
        this._busy = false;
    }
    Object.defineProperty(ModuleManager.prototype, "currentModule", {
        /**
         * 获取当前模块
         *
         * @readonly
         * @type {IMediatorConstructor|undefined}
         * @memberof ModuleManager
         */
        get: function () {
            var curData = this.getCurrent();
            return (curData && curData[0]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleManager.prototype, "currentModuleInstance", {
        /**
         * 获取当前模块的实例
         *
         * @readonly
         * @type {(IMediator|undefined)}
         * @memberof ModuleManager
         */
        get: function () {
            var curData = this.getCurrent();
            return (curData && curData[1]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleManager.prototype, "activeCount", {
        /**
         * 获取活动模块数量
         *
         * @readonly
         * @type {number}
         * @memberof ModuleManager
         */
        get: function () {
            return this._moduleStack.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取模块在栈中的索引
     *
     * @param {IMediatorConstructor} cls 模块类型
     * @returns {number} 索引值
     * @memberof ModuleManager
     */
    ModuleManager.prototype.getIndex = function (cls) {
        for (var i = 0, len = this._moduleStack.length; i < len; i++) {
            if (this._moduleStack[i][0] == cls)
                return i;
        }
        return -1;
    };
    /**
     * 获取索引处模块类型
     *
     * @param {number} index 模块索引值
     * @returns {IMediatorConstructor} 模块类型
     * @memberof ModuleManager
     */
    ModuleManager.prototype.getModule = function (index) {
        var data = this._moduleStack[index];
        return data && data[0];
    };
    ModuleManager.prototype.getAfter = function (cls) {
        var result = [];
        for (var _i = 0, _a = this._moduleStack; _i < _a.length; _i++) {
            var module = _a[_i];
            if (module[0] == cls)
                return result;
            result.push(module);
        }
        return null;
    };
    ModuleManager.prototype.getCurrent = function () {
        // 按顺序遍历模块，取出最新的没有在开启中的模块
        var target;
        for (var _i = 0, _a = this._moduleStack; _i < _a.length; _i++) {
            var temp = _a[_i];
            if (temp[0] !== this._opening) {
                target = temp;
                break;
            }
        }
        return target;
    };
    /**
     * 获取模块是否开启中
     *
     * @param {IMediatorConstructor} cls 要判断的模块类型
     * @returns {boolean} 是否开启
     * @memberof ModuleManager
     */
    ModuleManager.prototype.isOpened = function (cls) {
        return (this._moduleStack.filter(function (temp) { return temp[0] == cls; }).length > 0);
    };
    ModuleManager.prototype.activateModule = function (module, from, data) {
        if (module) {
            // 调用activate接口
            module.activate(from, data);
        }
    };
    ModuleManager.prototype.deactivateModule = function (module, to, data) {
        if (module) {
            // 调用deactivate接口
            module.deactivate(to, data);
        }
    };
    /**
     * 打开模块
     *
     * @param {ModuleType|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @param {boolean} [replace=false] 是否替换当前模块
     * @memberof ModuleManager
     */
    ModuleManager.prototype.open = function (module, data, replace) {
        var _this = this;
        if (replace === void 0) { replace = false; }
        return new Promise(function (resolve) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var type, cls, after, target, from, fromModule, moduleData, openData, i, len, closeData;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = (typeof module == "string" ? getModule(module) : module);
                        // 非空判断
                        if (!type)
                            return [2 /*return*/];
                        // 判断是否正在打开模块
                        if (this._busy) {
                            this._openCache.push([type, data, replace, resolve]);
                            return [2 /*return*/];
                        }
                        this._busy = true;
                        cls = getConstructor(type instanceof Function ? type : type.constructor);
                        after = this.getAfter(cls);
                        if (!!after) return [3 /*break*/, 2];
                        // 记录正在打开的模块类型
                        this._opening = type;
                        target = type instanceof Function ? new cls() : type;
                        // 赋值打开参数
                        target.data = data;
                        from = this.getCurrent();
                        fromModule = from && from[1];
                        moduleData = [cls, target, null];
                        this._moduleStack.unshift(moduleData);
                        // 设置回调
                        target.moduleOpenHandler = function (status, err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a, tempData;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = status;
                                        switch (_a) {
                                            case ModuleOpenStatus.Stop: return [3 /*break*/, 1];
                                            case ModuleOpenStatus.BeforeOpen: return [3 /*break*/, 3];
                                            case ModuleOpenStatus.AfterOpen: return [3 /*break*/, 4];
                                        }
                                        return [3 /*break*/, 6];
                                    case 1:
                                        // 需要判断是否是最后一个模块，最后一个模块不允许被销毁
                                        if (this._moduleStack.length > 1) {
                                            tempData = this._moduleStack.shift();
                                            // 销毁模块
                                            tempData[1].dispose();
                                        }
                                        // 派发失败消息
                                        core.dispatch(ModuleMessage.MODULE_CHANGE_FAILED, cls, from && from[0], err);
                                        // 结束一次模块开启
                                        return [4 /*yield*/, this.onFinishOpen()];
                                    case 2:
                                        // 结束一次模块开启
                                        _b.sent();
                                        return [3 /*break*/, 6];
                                    case 3:
                                        // 这里要优先关闭标识符，否则在开启的模块的onOpen方法里如果有操作Mask的动作就会被这个标识阻塞住
                                        this._opening = null;
                                        // 篡改target的close方法，使其改为触发ModuleManager的close
                                        moduleData[2] = target.hasOwnProperty("close") ? target.close : null;
                                        target.close = function (data) {
                                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                                return tslib_1.__generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, moduleManager.close(target, data)];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                });
                                            });
                                        };
                                        return [3 /*break*/, 6];
                                    case 4:
                                        // 调用onDeactivate接口
                                        this.deactivateModule(fromModule, target, data);
                                        // 调用onActivate接口
                                        this.activateModule(target, fromModule, data);
                                        // 如果replace是true，则关掉上一个模块
                                        if (replace)
                                            this.close(from && from[0], data);
                                        // 派发消息
                                        core.dispatch(ModuleMessage.MODULE_CHANGE, cls, fromModule);
                                        // 结束一次模块开启
                                        return [4 /*yield*/, this.onFinishOpen()];
                                    case 5:
                                        // 结束一次模块开启
                                        _b.sent();
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, target.open(data)];
                    case 1:
                        openData = _a.sent();
                        // 调用resolve
                        resolve(openData);
                        return [3 /*break*/, 7];
                    case 2:
                        if (!(after.length > 0)) return [3 /*break*/, 5];
                        // 已经打开且不是当前模块，先关闭当前模块到目标模块之间的所有模块
                        for (i = 1, len = after.length; i < len; i++) {
                            this.close(after[i][0], data);
                        }
                        return [4 /*yield*/, this.close(after[0][0], data)];
                    case 3:
                        closeData = _a.sent();
                        // 结束一次模块开启
                        return [4 /*yield*/, this.onFinishOpen()];
                    case 4:
                        // 结束一次模块开启
                        _a.sent();
                        // 调用resolve
                        resolve(closeData);
                        return [3 /*break*/, 7];
                    case 5: 
                    // 结束一次模块开启
                    return [4 /*yield*/, this.onFinishOpen()];
                    case 6:
                        // 结束一次模块开启
                        _a.sent();
                        // 调用resolve
                        resolve();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    ModuleManager.prototype.onFinishOpen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var openCache, openData;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 关闭标识符
                        this._opening = null;
                        this._busy = false;
                        if (!(this._openCache.length > 0)) return [3 /*break*/, 2];
                        openCache = this._openCache.shift();
                        return [4 /*yield*/, this.open.apply(this, openCache.slice(0, 3))];
                    case 1:
                        openData = _a.sent();
                        openCache[3](openData);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 关闭模块，只有关闭的是当前模块时才会触发onDeactivate和onActivate，否则只会触发close
     *
     * @param {ModuleType|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @memberof ModuleManager
     */
    ModuleManager.prototype.close = function (module, data) {
        var _this = this;
        return new Promise(function (resolve) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var type, cls, index, moduleData, target, oriClose, closeData, to, toModule;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = (typeof module == "string" ? getModule(module) : module);
                        // 非空判断
                        if (!type)
                            return [2 /*return*/];
                        // 数量判断，不足一个模块时不关闭
                        if (this.activeCount <= 1)
                            return [2 /*return*/];
                        cls = getConstructor(type instanceof Function ? type : type.constructor);
                        index = this.getIndex(cls);
                        if (index < 0)
                            return [2 /*return*/];
                        moduleData = this._moduleStack[index];
                        target = moduleData[1];
                        oriClose = moduleData[2];
                        if (oriClose)
                            target.close = oriClose;
                        else
                            delete target.close;
                        if (!(index == 0)) return [3 /*break*/, 2];
                        // 数据先行
                        this._moduleStack.shift();
                        to = this._moduleStack[0];
                        toModule = to && to[1];
                        // 调用onDeactivate接口
                        this.deactivateModule(target, toModule, data);
                        return [4 /*yield*/, target.close(data)];
                    case 1:
                        // 调用close接口
                        closeData = _a.sent();
                        // 调用onActivate接口
                        this.activateModule(toModule, target, data);
                        // 调用onWakeUp接口
                        toModule.wakeUp(target, data);
                        // 派发消息
                        core.dispatch(ModuleMessage.MODULE_CHANGE, to && to[0], cls);
                        return [3 /*break*/, 4];
                    case 2:
                        // 数据先行
                        this._moduleStack.splice(index, 1);
                        return [4 /*yield*/, target.close(data)];
                    case 3:
                        // 调用close接口
                        closeData = _a.sent();
                        _a.label = 4;
                    case 4:
                        resolve(closeData);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ModuleManager = tslib_1.__decorate([
        Injectable
    ], ModuleManager);
    return ModuleManager;
}());
export default ModuleManager;
/** 再额外导出一个单例 */
export var moduleManager = core.getInject(ModuleManager);
