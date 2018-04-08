import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import CoreMessage from "../../core/message/CoreMessage";
import { extendObject } from "../../utils/ObjectUtil";
import RequestData, { commonData } from "./RequestData";
import NetMessage from "./NetMessage";
import { maskManager } from "../mask/MaskManager";
var NetManager = /** @class */ (function () {
    function NetManager() {
        this._responseDict = {};
        this._responseListeners = {};
        core.listen(CoreMessage.MESSAGE_DISPATCHED, this.onMsgDispatched, core);
    }
    NetManager.prototype.onMsgDispatched = function (msg) {
        var observable = this.observable;
        // 如果消息是通讯消息则做处理
        if (msg instanceof RequestData) {
            // 添加遮罩
            if (msg.__useMask)
                maskManager.showLoading(null, "net");
            // 指定消息参数连接上公共参数作为参数
            extendObject(msg.__params.data, commonData);
            // 发送消息
            msg.__policy.sendRequest(msg);
            // 派发系统消息
            observable.dispatch(NetMessage.NET_REQUEST, msg);
        }
    };
    /**
     * 注册一个返回结构体
     *
     * @param {string} type 返回类型
     * @param {IResponseDataConstructor} cls 返回结构体构造器
     * @memberof NetManager
     */
    NetManager.prototype.registerResponse = function (cls) {
        this._responseDict[cls.type] = cls;
    };
    /**
     * 添加一个通讯返回监听
     *
     * @param {(IResponseDataConstructor|string)} clsOrType 要监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    NetManager.prototype.listenResponse = function (clsOrType, handler, thisArg, once, observable) {
        if (once === void 0) { once = false; }
        if (!observable)
            observable = core.observable;
        var type = (typeof clsOrType == "string" ? clsOrType : clsOrType.type);
        var listeners = this._responseListeners[type];
        if (!listeners)
            this._responseListeners[type] = listeners = [];
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            if (handler == listener[0] && thisArg == listener[1] && once == listener[2])
                return;
        }
        listeners.push([handler, thisArg, once, observable]);
    };
    /**
     * 移除一个通讯返回监听
     *
     * @param {(IResponseDataConstructor|string)} clsOrType 要移除监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    NetManager.prototype.unlistenResponse = function (clsOrType, handler, thisArg, once, observable) {
        if (once === void 0) { once = false; }
        if (!observable)
            observable = core.observable;
        var type = (typeof clsOrType == "string" ? clsOrType : clsOrType.type);
        var listeners = this._responseListeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var listener = listeners[i];
                if (handler == listener[0] && thisArg == listener[1] && once == listener[2] && observable == listener[3]) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    };
    /**
     * 发送多条请求，并且等待返回结果（如果有的话），调用回调
     *
     * @param {RequestData[]} [requests 要发送的请求列表
     * @param {(responses?:ResponseData[]|Error)=>void} [handler] 收到返回结果或错误后的回调函数
     * @param {*} [thisArg] this指向
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    NetManager.prototype.sendMultiRequests = function (requests, handler, thisArg, observable) {
        var self = this;
        var responses = [];
        var leftResCount = 0;
        if (!observable)
            observable = core.observable;
        for (var _i = 0, _a = requests || []; _i < _a.length; _i++) {
            var request = _a[_i];
            var response = request.__params.response;
            if (response) {
                // 监听一次性返回
                this.listenResponse(response, onResponse, request);
                // 记录返回监听
                responses.push(response);
                // 记录数量
                leftResCount++;
            }
            // 发送请求
            observable.dispatch(request);
        }
        // 测试回调
        testCallback();
        function onResponse(response) {
            if (response instanceof Error) {
                // 出错了，直接调用回调
                handler && handler.call(thisArg, response);
            }
            else {
                // 成功了
                for (var key in responses) {
                    var temp = responses[key];
                    if (temp == response.constructor && this === response.__params.request) {
                        self.unlistenResponse(temp, onResponse, this);
                        responses[key] = response;
                        leftResCount--;
                        // 测试回调
                        testCallback();
                        break;
                    }
                }
            }
        }
        function testCallback() {
            // 判断是否全部替换完毕
            if (leftResCount <= 0) {
                handler && handler.call(thisArg, responses);
            }
        }
    };
    /** 这里导出不希望用户使用的方法，供框架内使用 */
    NetManager.prototype.__onResponse = function (type, result, request) {
        // 移除遮罩
        if (request && request.__useMask)
            maskManager.hideLoading("net");
        // 解析结果
        var cls = this._responseDict[type];
        if (cls) {
            var response = new cls();
            // 执行解析
            response.parse(result);
            // 设置配对请求和发送内核
            var observable = core.observable;
            if (request) {
                response.__params.request = request;
                // 由上至下找到最远的一个有效内核
                for (var i = request.__observables.length - 1; i >= 0; i--) {
                    var temp = request.__observables[i];
                    if (!temp || temp.disposed)
                        break;
                    else
                        observable = temp;
                }
            }
            // 派发事件
            observable.dispatch(NetMessage.NET_RESPONSE, response, request);
            // 递归处理事件监听
            this.recurseResponse(type, response, request, observable);
        }
        else {
            console.warn("没有找到返回结构体定义：" + type);
        }
    };
    NetManager.prototype.__onError = function (type, err, request) {
        // 移除遮罩
        if (request && request.__useMask)
            maskManager.hideLoading("net");
        // 如果有配对请求，则将返回值发送到请求所在的原始内核里
        var observable = request && request.__oriObservable;
        // 派发事件
        observable.dispatch(NetMessage.NET_ERROR, err, request);
        // 递归处理事件监听
        this.recurseResponse(type, err, request, observable);
    };
    NetManager.prototype.recurseResponse = function (type, response, request, observable) {
        // 先递归父级，与消息发送时顺序相反
        if (observable.parent) {
            this.recurseResponse(type, response, request, observable.parent);
        }
        // 触发事件形式监听
        var listeners = this._responseListeners[type];
        if (listeners) {
            listeners = listeners.concat();
            for (var _i = 0, listeners_2 = listeners; _i < listeners_2.length; _i++) {
                var listener = listeners_2[_i];
                if (listener[3] == observable) {
                    // 必须是同核消息才能触发回调
                    listener[0].call(listener[1], response, request);
                    // 如果是一次性监听则移除之
                    if (listener[2])
                        this.unlistenResponse(type, listener[0], listener[1], listener[2], listener[3]);
                }
            }
        }
    };
    NetManager = tslib_1.__decorate([
        Injectable,
        tslib_1.__metadata("design:paramtypes", [])
    ], NetManager);
    return NetManager;
}());
export default NetManager;
/** 再额外导出一个单例 */
export var netManager = core.getInject(NetManager);
