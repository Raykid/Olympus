import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 用来记录程序运行时间，并且提供延迟回调或频率回调功能
*/
var System = /** @class */ (function () {
    function System() {
        // 这里尝试一下TS的Tuple类型——Raykid
        this._nextFrameList = [];
        this._timer = 0;
        var self = this;
        if (window.requestAnimationFrame instanceof Function) {
            requestAnimationFrame(onRequestAnimationFrame);
        }
        else {
            // 如果不支持requestAnimationFrame则改用setTimeout计时，延迟时间1000/60毫秒
            var startTime = Date.now();
            setInterval(function () {
                var curTime = Date.now();
                // 赋值timer
                self._timer = curTime - startTime;
                // 调用tick方法
                self.tick();
            }, 1000 / 60);
        }
        function onRequestAnimationFrame(timer) {
            // 赋值timer，这个方法里无法获取this，因此需要通过注入的静态属性取到自身实例
            self._timer = timer;
            // 调用tick方法
            self.tick();
            // 计划下一次执行
            requestAnimationFrame(onRequestAnimationFrame);
        }
    }
    /**
     * 获取从程序运行到当前所经过的毫秒数
     *
     * @returns {number} 毫秒数
     * @memberof System
     */
    System.prototype.getTimer = function () {
        return this._timer;
    };
    System.prototype.tick = function () {
        // 调用下一帧回调
        for (var i = 0, len = this._nextFrameList.length; i < len; i++) {
            var data = this._nextFrameList.shift();
            data[0].apply(data[1], data[2]);
        }
    };
    /**
     * 在下一帧执行某个方法
     *
     * @param {Function} handler 希望在下一帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    System.prototype.nextFrame = function (handler, thisArg) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var data = [handler, thisArg, args];
        this._nextFrameList.push(data);
        return {
            cancel: function () {
                var index = _this._nextFrameList.indexOf(data);
                if (index >= 0)
                    _this._nextFrameList.splice(index, 1);
            }
        };
    };
    /**
     * 每帧执行某个方法，直到取消为止
     *
     * @param {Function} handler 每帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    System.prototype.enterFrame = function (handler, thisArg) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var self = this;
        var cancelable = this.nextFrame.apply(this, [wrapHandler, thisArg].concat(args));
        return {
            cancel: function () {
                cancelable.cancel();
            }
        };
        function wrapHandler() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // 调用回调
            handler.apply(this, args);
            // 执行下一帧
            cancelable = self.nextFrame.apply(self, [wrapHandler, this].concat(args));
        }
    };
    /**
     * 设置延迟回调
     *
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    System.prototype.setTimeout = function (duration, handler, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var startTimer = this._timer;
        // 启动计时器
        var nextFrame = this.nextFrame(tick, this);
        function tick() {
            var delta = this._timer - startTimer;
            if (delta >= duration) {
                nextFrame = null;
                handler.apply(thisArg, args);
            }
            else {
                nextFrame = this.nextFrame(tick, this);
            }
        }
        return {
            cancel: function () {
                nextFrame && nextFrame.cancel();
                nextFrame = null;
            }
        };
    };
    /**
     * 设置延时间隔
     *
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    System.prototype.setInterval = function (duration, handler, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var timeout = this.setTimeout(duration, onTimeout, this);
        function onTimeout() {
            // 触发回调
            handler.apply(thisArg, args);
            // 继续下一次
            timeout = this.setTimeout(duration, onTimeout, this);
        }
        return {
            cancel: function () {
                timeout && timeout.cancel();
                timeout = null;
            }
        };
    };
    System = tslib_1.__decorate([
        Injectable,
        tslib_1.__metadata("design:paramtypes", [])
    ], System);
    return System;
}());
export default System;
/** 再额外导出一个单例 */
export var system = core.getInject(System);
