var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../core/injector/Injector", "../../core/Core", "../../utils/Dictionary", "./Bind", "./Utils", "../net/NetManager"], function (require, exports, Injector_1, Core_1, Dictionary_1, Bind_1, Utils_1, NetManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            this._bindDict = new Dictionary_1.default();
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
                    bind: new Bind_1.default(mediator),
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
        BindManager.prototype.search = function (values, ui, callback) {
            for (var key in values) {
                var value = values[key];
                var index = key.indexOf(".");
                if (index >= 0) {
                    // 是表达式寻址，递归寻址
                    var newValue = {};
                    newValue[key.substr(index + 1)] = value;
                    this.search(newValue, ui[key.substring(0, index)], callback);
                }
                else if (typeof value != "string") {
                    // 是子对象寻址，递归寻址
                    this.search(value, ui[key], callback);
                }
                else {
                    // 是表达式，调用回调
                    callback(ui, key, value);
                }
            }
        };
        BindManager.prototype.delaySearch = function (mediator, values, ui, callback) {
            var _this = this;
            var handler = function () {
                // 判断数据是否合法
                if (!mediator.viewModel)
                    return;
                // 开始绑定
                _this.search(values, ui, callback);
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
         * @param {{[name:string]:string}} uiDict ui属性字典
         * @param {*} ui 绑定到的ui实体对象
         * @memberof BindManager
         */
        BindManager.prototype.bindValue = function (mediator, uiDict, ui) {
            var bindData = this._bindDict.get(mediator);
            this.delaySearch(mediator, uiDict, ui, function (ui, key, exp) {
                bindData.bind.createWatcher(ui, exp, mediator.viewModel, function (value) {
                    ui[key] = value;
                });
            });
        };
        /**
         * 绑定事件
         *
         * @param {IMediator} mediator 中介者
         * @param {{[type:string]:string}} evtDict 事件字典
         * @param {*} ui 绑定到的ui实体对象
         * @memberof BindManager
         */
        BindManager.prototype.bindOn = function (mediator, evtDict, ui) {
            this.delaySearch(mediator, evtDict, ui, function (ui, key, exp) {
                var handler = mediator.viewModel[exp];
                var commonScope = {
                    $this: mediator,
                    $bridge: mediator.bridge,
                    $target: ui
                };
                // 如果取不到handler，则把exp当做一个执行表达式处理，外面包一层方法
                if (!handler) {
                    var func = Utils_1.createRunFunc(exp, 2);
                    handler = function () {
                        func.call(this, mediator.viewModel, commonScope);
                    };
                }
                mediator.bridge.mapListener(ui, key, handler, mediator.viewModel);
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
         * @param {{[name:string]:string}} uiDict 判断字典
         * @param {*} ui 绑定到的ui实体对象
         * @memberof BindManager
         */
        BindManager.prototype.bindIf = function (mediator, uiDict, ui) {
            var _this = this;
            var bindData = this._bindDict.get(mediator);
            var replacer = mediator.bridge.createEmptyDisplay();
            this.delaySearch(mediator, uiDict, ui, function (ui, key, exp) {
                // 寻址到指定目标
                ui = ui[key] || ui;
                // 绑定表达式
                bindData.bind.createWatcher(ui, exp, mediator.viewModel, function (value) {
                    // 如果表达式为true则显示ui，否则移除ui
                    if (value)
                        _this.replaceDisplay(mediator.bridge, replacer, ui);
                    else
                        _this.replaceDisplay(mediator.bridge, ui, replacer);
                });
            });
        };
        /**
         * 绑定全局Message
         *
         * @param {IMediator} mediator 中介者
         * @param {IConstructor|string} type 绑定的消息类型字符串
         * @param {{[name:string]:string}} uiDict ui表达式字典
         * @param {*} ui 绑定到的ui实体对象
         * @param {IObservable} [observable] 绑定的消息内核，默认是core
         * @memberof BindManager
         */
        BindManager.prototype.bindMessage = function (mediator, type, uiDict, ui, observable) {
            var _this = this;
            if (!observable)
                observable = Core_1.core.observable;
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
                    _this.search(uiDict, ui, function (ui, key, exp) {
                        // 设置通用属性
                        var commonScope = {
                            $this: mediator,
                            $bridge: mediator.bridge,
                            $target: ui
                        };
                        ui[key] = Utils_1.evalExp(exp, mediator.viewModel, msg, mediator.viewModel, commonScope);
                    });
                }
            };
            // 添加监听
            observable.listen(type, handler);
        };
        /**
         * 绑定全局Response
         *
         * @param {IMediator} mediator 中介者
         * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
         * @param {{[name:string]:string}} uiDict ui表达式字典
         * @param {*} ui 绑定到的ui实体对象
         * @param {IObservable} [observable] 绑定的消息内核，默认是core
         * @memberof BindManager
         */
        BindManager.prototype.bindResponse = function (mediator, type, uiDict, ui, observable) {
            var _this = this;
            if (!observable)
                observable = Core_1.core.observable;
            var bindData = this._bindDict.get(mediator);
            var handler = function (response) {
                if (mediator.disposed) {
                    // mediator已销毁，取消监听
                    NetManager_1.netManager.unlistenResponse(type, handler, null, null, observable);
                }
                else {
                    _this.search(uiDict, ui, function (ui, key, exp) {
                        // 设置通用属性
                        var commonScope = {
                            $this: mediator,
                            $bridge: mediator.bridge,
                            $target: ui
                        };
                        ui[key] = Utils_1.evalExp(exp, mediator.viewModel, response, mediator.viewModel, commonScope);
                    });
                }
            };
            // 添加监听
            NetManager_1.netManager.listenResponse(type, handler, null, null, observable);
            // 如果mediator所依赖的模块有初始化消息，则要额外触发初始化消息的绑定
            if (mediator["dependModuleInstance"]) {
                for (var _i = 0, _a = mediator["dependModuleInstance"].responses; _i < _a.length; _i++) {
                    var response = _a[_i];
                    handler(response);
                }
            }
        };
        BindManager = __decorate([
            Injector_1.Injectable
        ], BindManager);
        return BindManager;
    }());
    exports.default = BindManager;
    /** 再额外导出一个单例 */
    exports.bindManager = Core_1.core.getInject(BindManager);
});
//# sourceMappingURL=BindManager.js.map