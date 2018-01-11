var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import Dictionary from "../../utils/Dictionary";
import Bind from "./Bind";
import { evalExp, createRunFunc } from "./Utils";
import { netManager } from "../net/NetManager";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 绑定管理器，可以将数据和显示对象绑定到一起，MVVM书写界面
*/
var BindManager = /** @class */ (function () {
    function BindManager() {
        this._bindDict = new Dictionary();
        this._regExp = /^\s*(\w+)\s+((in)|(of))\s+(.+?)\s*$/;
    }
    /**
     * 绑定数据到UI上
     *
     * @param {IMediator} mediator 中介者
     * @returns {Bind} 返回绑定实例
     * @memberof BindManager
     */
    BindManager.prototype.bind = function (mediator) {
        var bindData = this._bindDict.get(mediator);
        if (!bindData) {
            this._bindDict.set(mediator, bindData = {
                bind: new Bind(mediator),
                callbacks: []
            });
        }
        // 重新绑定所有
        for (var _i = 0, _a = bindData.callbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            callback();
        }
        // 返回Bind对象
        return bindData.bind;
    };
    /**
     * 移除绑定
     *
     * @param {IMediator} mediator
     * @returns {Bind}
     * @memberof BindManager
     */
    BindManager.prototype.unbind = function (mediator) {
        var bindData = this._bindDict.get(mediator);
        if (bindData)
            this._bindDict.delete(mediator);
        return bindData && bindData.bind;
    };
    BindManager.prototype.addBindHandler = function (mediator, callback) {
        var handler = function () {
            // 判断数据是否合法
            if (!mediator.viewModel)
                return;
            // 开始绑定
            callback();
        };
        // 添加绑定数据
        var bindData = this._bindDict.get(mediator);
        if (bindData.callbacks.indexOf(handler) < 0)
            bindData.callbacks.push(handler);
        // 立即调用一次
        handler();
    };
    /**
     * 绑定属性值
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定的属性名
     * @param {(EvalExp)} exp 绑定的表达式或方法
     * @memberof BindManager
     */
    BindManager.prototype.bindValue = function (mediator, currentTarget, target, envModels, name, exp) {
        var watcher;
        var bindData = this._bindDict.get(mediator);
        this.addBindHandler(mediator, function () {
            // 如果之前绑定过，则要先销毁之
            if (watcher)
                watcher.dispose();
            // 绑定新的订阅者
            watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, exp, function (value) {
                    currentTarget[name] = value;
                }, mediator.viewModel].concat(envModels, [mediator.viewModel]));
            var _a;
        });
    };
    /**
     * 绑定方法执行
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定的方法名
     * @param {...(EvalExp)[]} argExps 执行方法的参数表达式或方法列表
     * @memberof BindManager
     */
    BindManager.prototype.bindFunc = function (mediator, currentTarget, target, envModels, name) {
        var _this = this;
        var argExps = [];
        for (var _i = 5; _i < arguments.length; _i++) {
            argExps[_i - 5] = arguments[_i];
        }
        var watchers = [];
        var bindData = this._bindDict.get(mediator);
        this.addBindHandler(mediator, function () {
            // 判断参数数量，无参数方法一次性执行即可，无需绑定，有参数的方法则需要每次参数改变就执行一次
            if (argExps.length > 0) {
                // 将表达式中所有undefined和null变为内部值
                var undefinedValue = Date.now() * Math.random() + "_undefined";
                var nullValue = Date.now() * Math.random() + "_null";
                argExps = argExps.map(function (exp) {
                    if (exp === undefined)
                        return "'" + undefinedValue + "'";
                    else if (exp === null)
                        return "'" + nullValue + "'";
                    else
                        return exp;
                });
                // 绑定表达式参数数组
                var initValue = {};
                var args = [];
                var argsInited = false;
                var handler = function (index, value) {
                    // 将value中的undefined和null恢复回去
                    if (value === undefinedValue)
                        value = undefined;
                    else if (value == nullValue)
                        value = null;
                    // 设置参数值
                    args[index] = value;
                    // 判断参数是否齐全
                    if (!argsInited) {
                        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                            var arg = args_1[_i];
                            // 如果列表里存在初始值，表示没有赋值完毕，直接返回
                            if (arg === initValue)
                                return;
                        }
                        // 设置初始化完毕状态
                        argsInited = true;
                    }
                    // 赋值已经完毕了，调用方法，this指向ui本身
                    currentTarget[name].apply(currentTarget, args);
                };
                // 清理旧的订阅者
                for (var i = 0, len = watchers.length; i < len; i++) {
                    watchers.shift().dispose();
                }
                // 循环绑定表达式到handler
                for (var i = 0, len = argExps.length; i < len; i++) {
                    // 记录一个初始值，用于判断参数列表是否已赋值完毕
                    args.push(initValue);
                }
                for (var i = 0, len = argExps.length; i < len; i++) {
                    // 绑定表达式
                    var watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, argExps[i], handler.bind(_this, i), mediator.viewModel].concat(envModels, [mediator.viewModel]));
                    // 记录订阅者
                    watchers.push(watcher);
                }
            }
            else {
                // 无参数执行，无需绑定，一次性执行即可
                target[name]();
            }
            var _a;
        });
    };
    /**
     * 绑定事件
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} type 绑定的事件类型
     * @param {EvalExp} exp 绑定的事件回调表达式或方法
     * @memberof BindManager
     */
    BindManager.prototype.bindOn = function (mediator, currentTarget, target, envModels, type, exp) {
        var handler;
        this.addBindHandler(mediator, function () {
            var commonScope = {
                $this: mediator,
                $data: mediator.viewModel,
                $bridge: mediator.bridge,
                $currentTarget: currentTarget,
                $target: target
            };
            // 如果之前添加过监听，则先移除之
            if (!handler) {
                mediator.bridge.unmapListener(currentTarget, type, handler, mediator.viewModel);
                handler = null;
            }
            // 先尝试用exp当做方法名去viewModel里寻找，如果找不到则把exp当做一个执行表达式处理，外面包一层方法
            if (typeof exp === "string")
                handler = mediator.viewModel[exp];
            if (!handler) {
                var func = createRunFunc(exp, 2 + envModels.length);
                // 这里要转一手，记到闭包里一个副本，否则因为bindOn是延迟操作，到时envModel可能已被修改
                handler = function () {
                    func.call.apply(func, [this, commonScope].concat(envModels, [mediator.viewModel]));
                };
            }
            mediator.bridge.mapListener(currentTarget, type, handler, mediator.viewModel);
        });
    };
    BindManager.prototype.replaceDisplay = function (bridge, ori, cur) {
        var parent = bridge.getParent(ori);
        if (parent) {
            // ori有父级，记录其当前索引
            var index = bridge.getChildIndex(parent, ori);
            // 移除ori
            bridge.removeChild(parent, ori);
            // 显示cur
            bridge.addChildAt(parent, cur, index);
        }
    };
    /**
     * 绑定显示
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {EvalExp} exp 绑定表达式或方法
     * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
     * @memberof BindManager
     */
    BindManager.prototype.bindIf = function (mediator, currentTarget, target, envModels, exp, callback) {
        var _this = this;
        var watcher;
        var bindData = this._bindDict.get(mediator);
        var replacer = mediator.bridge.createEmptyDisplay();
        this.addBindHandler(mediator, function () {
            // 如果之前绑定过，则要先销毁之
            if (watcher)
                watcher.dispose();
            // 绑定表达式
            watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, exp, function (value) {
                    // 如果表达式为true则显示ui，否则移除ui
                    if (value)
                        _this.replaceDisplay(mediator.bridge, replacer, currentTarget);
                    else
                        _this.replaceDisplay(mediator.bridge, currentTarget, replacer);
                    // 触发回调
                    callback && callback(value);
                }, mediator.viewModel].concat(envModels, [mediator.viewModel]));
            var _a;
        });
    };
    /**
     * 绑定循环
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} exp 循环表达式，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）。b可以是个表达式
     * @param {(data:any, renderer:any, envModels:any[])=>void} [callback] 每次生成新的renderer实例时调用这个回调
     * @memberof BindManager
     */
    BindManager.prototype.bindFor = function (mediator, currentTarget, target, envModels, exp, callback) {
        var _this = this;
        var watcher;
        var bindData = this._bindDict.get(mediator);
        var replacer = mediator.bridge.createEmptyDisplay();
        this.addBindHandler(mediator, function () {
            // 解析表达式
            var res = _this._regExp.exec(exp);
            if (!res)
                return;
            // 包装渲染器创建回调
            var memento = mediator.bridge.wrapBindFor(currentTarget, function (key, value, renderer) {
                // 设置环境变量
                var commonScope = {
                    $key: key,
                    $value: value,
                    $parent: envModels[0] || mediator.viewModel
                };
                // 填入用户声明的属性
                commonScope[res[1]] = (res[2] == "in" ? key : value);
                // 生成一个环境变量的副本
                var subEnvModels = envModels.concat();
                // 插入环境变量
                subEnvModels.unshift(commonScope);
                // 触发回调，进行内部编译
                callback && callback(value, renderer, subEnvModels);
            });
            // 如果之前绑定过，则要先销毁之
            if (watcher)
                watcher.dispose();
            // 获得要遍历的数据集合
            watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, res[5], function (datas) {
                    // 如果遍历的对象是个数字，则伪造一个临时数组供使用
                    if (typeof datas === "number") {
                        var tempArr = [];
                        for (var i = 0; i < datas; i++) {
                            tempArr.push(i);
                        }
                        datas = tempArr;
                    }
                    // 赋值
                    mediator.bridge.valuateBindFor(currentTarget, datas, memento);
                }, mediator.viewModel].concat(envModels, [mediator.viewModel]));
            var _a;
        });
    };
    /**
     * 绑定Message
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {IConstructor|string} type 绑定的消息类型字符串
     * @param {string} name 绑定的属性名
     * @param {EvalExp} exp 绑定的表达式或方法
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    BindManager.prototype.bindMessage = function (mediator, currentTarget, target, envModels, type, name, exp, observable) {
        if (!observable)
            observable = core.observable;
        var bindData = this._bindDict.get(mediator);
        var handler = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (mediator.disposed) {
                // mediator已销毁，取消监听
                observable.unlisten(type, handler);
            }
            else {
                var msg;
                if (args.length == 1 && typeof args[0] == "object" && args[0].type)
                    msg = args[0];
                else
                    msg = { $arguments: args };
                // 设置通用属性
                var commonScope = {
                    $this: mediator,
                    $data: mediator.viewModel,
                    $bridge: mediator.bridge,
                    $currentTarget: currentTarget,
                    $target: target
                };
                currentTarget[name] = evalExp.apply(void 0, [exp, mediator.viewModel, msg].concat(envModels, [mediator.viewModel, commonScope]));
            }
        };
        // 添加监听
        observable.listen(type, handler);
    };
    /**
     * 绑定Response
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
     * @param {string} name 绑定的属性名
     * @param {EvalExp} exp 绑定的表达式或方法
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    BindManager.prototype.bindResponse = function (mediator, currentTarget, target, envModels, type, name, exp, observable) {
        if (!observable)
            observable = core.observable;
        var bindData = this._bindDict.get(mediator);
        var handler = function (response) {
            if (mediator.disposed) {
                // mediator已销毁，取消监听
                netManager.unlistenResponse(type, handler, null, null, observable);
            }
            else {
                // 设置通用属性
                var commonScope = {
                    $this: mediator,
                    $data: mediator.viewModel,
                    $bridge: mediator.bridge,
                    $currentTarget: currentTarget,
                    $target: target
                };
                currentTarget[name] = evalExp.apply(void 0, [exp, mediator.viewModel, response].concat(envModels, [mediator.viewModel, commonScope]));
            }
        };
        // 添加监听
        netManager.listenResponse(type, handler, null, null, observable);
        // 如果mediator所依赖的模块有初始化消息，则要额外触发初始化消息的绑定
        if (mediator["dependModuleInstance"]) {
            for (var _i = 0, _a = mediator["dependModuleInstance"].responses; _i < _a.length; _i++) {
                var response = _a[_i];
                handler(response);
            }
        }
    };
    BindManager = __decorate([
        Injectable
    ], BindManager);
    return BindManager;
}());
export default BindManager;
/** 再额外导出一个单例 */
export var bindManager = core.getInject(BindManager);
