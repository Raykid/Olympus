define(["require", "exports", "../../core/injector/Injector", "../../core/message/Message", "../../utils/ConstructUtil", "../net/ResponseData", "../net/NetManager", "../bridge/BridgeManager", "../mediator/Mediator", "../module/ModuleManager", "../../utils/Dictionary", "../bind/BindManager"], function (require, exports, Injector_1, Message_1, ConstructUtil_1, ResponseData_1, NetManager_1, BridgeManager_1, Mediator_1, ModuleManager_1, Dictionary_1, BindManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * 负责注入的模块
    */
    /** 定义数据模型，支持实例注入，并且自身也会被注入 */
    function ModelClass() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 转调Injectable方法
        if (this === undefined) {
            var cls = ConstructUtil_1.wrapConstruct(args[0]);
            Injector_1.Injectable.call(this, cls);
            return cls;
        }
        else {
            var result = Injector_1.Injectable.apply(this, args);
            return function (realCls) {
                realCls = ConstructUtil_1.wrapConstruct(realCls);
                result.call(this, realCls);
                return realCls;
            };
        }
    }
    exports.ModelClass = ModelClass;
    /** 定义界面中介者，支持实例注入，并可根据所赋显示对象自动调整所使用的表现层桥 */
    function MediatorClass(cls) {
        // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
        if (!cls.prototype.dispose)
            console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
        // 监听实例化
        ConstructUtil_1.listenConstruct(cls, function (instance) {
            // 替换setSkin方法
            var $skin;
            Object.defineProperty(instance, "skin", {
                configurable: true,
                enumerable: true,
                get: function () {
                    return $skin;
                },
                set: function (value) {
                    // 记录值
                    $skin = value;
                    // 根据skin类型选取表现层桥
                    this.bridge = BridgeManager_1.bridgeManager.getBridgeBySkin(value);
                }
            });
        });
        return ConstructUtil_1.wrapConstruct(cls);
    }
    exports.MediatorClass = MediatorClass;
    /** 定义模块，支持实例注入 */
    function ModuleClass(cls) {
        // 判断一下Module是否有dispose方法，没有的话弹一个警告
        if (!cls.prototype.dispose)
            console.warn("Module[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Module实现IDisposable接口");
        // 包装类
        var wrapperCls = ConstructUtil_1.wrapConstruct(cls);
        // 注册模块
        ModuleManager_1.moduleManager.registerModule(wrapperCls);
        // 返回包装类
        return wrapperCls;
    }
    exports.ModuleClass = ModuleClass;
    function ModuleMessageHandler(target, key) {
        if (key) {
            var defs = Reflect.getMetadata("design:paramtypes", target, key);
            var resClass = defs[0];
            if (!(resClass.prototype instanceof Message_1.default))
                throw new Error("@ModuleMessageHandler装饰器装饰的方法的首个参数必须是Message");
            doModuleMessageHandler(target.constructor, key, resClass);
        }
        else {
            return function (prototype, propertyKey, descriptor) {
                doModuleMessageHandler(prototype.constructor, propertyKey, target);
            };
        }
    }
    exports.ModuleMessageHandler = ModuleMessageHandler;
    ;
    function doModuleMessageHandler(cls, key, type) {
        // 监听实例化
        ConstructUtil_1.listenConstruct(cls, function (instance) {
            if (instance instanceof Mediator_1.default) {
                // 如果是Mediator，则需要等到被托管后再执行注册
                addDelegateHandler(instance, function () {
                    instance.dependModuleInstance.listenModule(type, instance[key], instance);
                });
            }
            else {
                var module = instance.dependModuleInstance;
                module && module.listenModule(type, instance[key], instance);
            }
        });
        // 监听销毁
        ConstructUtil_1.listenDispose(cls, function (instance) {
            var module = instance.dependModuleInstance;
            module && module.unlistenModule(type, instance[key], instance);
        });
    }
    function ResponseHandler(target, key) {
        if (key) {
            var defs = Reflect.getMetadata("design:paramtypes", target, key);
            var resClass = defs[0];
            if (!(resClass.prototype instanceof ResponseData_1.default))
                throw new Error("无参数@ResponseHandler装饰器装饰的方法的首个参数必须是ResponseData");
            doResponseHandler(target.constructor, key, defs[0]);
        }
        else {
            return function (prototype, propertyKey, descriptor) {
                doResponseHandler(prototype.constructor, propertyKey, target);
            };
        }
    }
    exports.ResponseHandler = ResponseHandler;
    function doResponseHandler(cls, key, type) {
        // 监听实例化
        ConstructUtil_1.listenConstruct(cls, function (instance) {
            NetManager_1.netManager.listenResponse(type, instance[key], instance);
        });
        // 监听销毁
        ConstructUtil_1.listenDispose(cls, function (instance) {
            NetManager_1.netManager.unlistenResponse(type, instance[key], instance);
        });
    }
    var delegateHandlerDict = new Dictionary_1.default();
    function addDelegateHandler(instance, handler) {
        if (!instance)
            return;
        var handlers = delegateHandlerDict.get(instance);
        if (!handlers)
            delegateHandlerDict.set(instance, handlers = []);
        if (handlers.indexOf(handler) < 0)
            handlers.push(handler);
    }
    /** 在Module内托管Mediator */
    function DelegateMediator(prototype, propertyKey) {
        if (prototype.delegateMediator instanceof Function && prototype.undelegateMediator instanceof Function) {
            // 监听实例化
            ConstructUtil_1.listenConstruct(prototype.constructor, function (instance) {
                // 实例化
                var mediator = instance[propertyKey];
                if (mediator === undefined) {
                    var cls = Reflect.getMetadata("design:type", prototype, propertyKey);
                    instance[propertyKey] = mediator = new cls();
                }
                // 赋值所属模块
                mediator["_dependModuleInstance"] = instance;
                mediator["_dependModule"] = ConstructUtil_1.getConstructor(prototype.constructor);
                // 执行回调
                var handlers = delegateHandlerDict.get(mediator);
                if (handlers) {
                    for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                        var handler = handlers_1[_i];
                        handler(mediator);
                    }
                    // 移除记录
                    delegateHandlerDict.delete(mediator);
                }
            });
            // 监听销毁
            ConstructUtil_1.listenDispose(prototype.constructor, function (instance) {
                var mediator = instance[propertyKey];
                if (mediator) {
                    // 移除所属模块
                    mediator["_dependModuleInstance"] = undefined;
                    mediator["_dependModule"] = undefined;
                    // 移除实例
                    instance[propertyKey] = undefined;
                }
            });
            // 篡改属性
            var mediator;
            return {
                configurable: true,
                enumerable: true,
                get: function () {
                    return mediator;
                },
                set: function (value) {
                    if (value == mediator)
                        return;
                    // 取消托管中介者
                    if (mediator) {
                        this.undelegateMediator(mediator);
                    }
                    // 设置中介者
                    mediator = value;
                    // 托管新的中介者
                    if (mediator) {
                        this.delegateMediator(mediator);
                    }
                }
            };
        }
    }
    exports.DelegateMediator = DelegateMediator;
    function listenOnOpen(prototype, propertyKey, before, after) {
        ConstructUtil_1.listenConstruct(prototype.constructor, function (mediator) {
            // 篡改onOpen方法
            var oriFunc = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
            mediator.onOpen = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // 调用回调
                before && before(mediator);
                // 恢复原始方法
                if (oriFunc)
                    mediator.onOpen = oriFunc;
                else
                    delete mediator.onOpen;
                // 调用原始方法
                mediator.onOpen.apply(this, args);
                // 调用回调
                after && after(mediator);
            };
        });
    }
    /**
     * @private
     */
    function BindValue(arg1, arg2) {
        return function (prototype, propertyKey) {
            listenOnOpen(prototype, propertyKey, function (mediator) {
                // 组织参数字典
                var uiDict;
                if (typeof arg1 == "string") {
                    uiDict = {};
                    uiDict[arg1] = arg2;
                }
                else {
                    uiDict = arg1;
                }
                BindManager_1.bindManager.bindValue(mediator, uiDict, mediator[propertyKey]);
            });
        };
    }
    exports.BindValue = BindValue;
    /**
     * @private
     */
    function BindOn(arg1, arg2) {
        return function (prototype, propertyKey) {
            listenOnOpen(prototype, propertyKey, function (mediator) {
                // 组织参数字典
                var evtDict;
                if (typeof arg1 == "string") {
                    evtDict = {};
                    evtDict[arg1] = arg2;
                }
                else {
                    evtDict = arg1;
                }
                BindManager_1.bindManager.bindOn(mediator, evtDict, mediator[propertyKey]);
            });
        };
    }
    exports.BindOn = BindOn;
    /**
     * @private
     */
    function BindIf(arg1, arg2) {
        return function (prototype, propertyKey) {
            listenOnOpen(prototype, propertyKey, function (mediator) {
                // 组织参数字典
                var uiDict;
                if (typeof arg1 == "string") {
                    uiDict = {};
                    if (arg2)
                        uiDict[arg1] = arg2; // 有name寻址
                    else
                        uiDict["$target"] = arg1; // 没有name寻址，直接绑定表达式
                }
                else {
                    uiDict = arg1;
                }
                BindManager_1.bindManager.bindIf(mediator, uiDict, mediator[propertyKey]);
            });
        };
    }
    exports.BindIf = BindIf;
    /**
     * @private
     */
    function BindMessage(arg1, arg2) {
        return function (prototype, propertyKey) {
            listenOnOpen(prototype, propertyKey, function (mediator) {
                if (typeof arg1 == "string" || arg1 instanceof Function) {
                    // 是类型方式
                    BindManager_1.bindManager.bindMessage(mediator, arg1, arg2, mediator[propertyKey]);
                }
                else {
                    // 是字典方式
                    for (var type in arg1) {
                        BindManager_1.bindManager.bindMessage(mediator, type, arg1[type], mediator[propertyKey]);
                    }
                }
            });
        };
    }
    exports.BindMessage = BindMessage;
    /**
     * @private
     */
    function BindModuleMessage(arg1, arg2) {
        return function (prototype, propertyKey) {
            listenOnOpen(prototype, propertyKey, function (mediator) {
                if (typeof arg1 == "string" || arg1 instanceof Function) {
                    // 是类型方式
                    BindManager_1.bindManager.bindMessage(mediator, arg1, arg2, mediator[propertyKey], mediator.observable);
                }
                else {
                    // 是字典方式
                    for (var type in arg1) {
                        BindManager_1.bindManager.bindMessage(mediator, type, arg1[type], mediator[propertyKey], mediator.observable);
                    }
                }
            });
        };
    }
    exports.BindModuleMessage = BindModuleMessage;
    /**
     * @private
     */
    function BindResponse(arg1, arg2) {
        return function (prototype, propertyKey) {
            // Response需要在onOpen之后执行，因为可能有初始化消息需要绑定，要在onOpen后有了viewModel再首次更新显示
            listenOnOpen(prototype, propertyKey, null, function (mediator) {
                if (typeof arg1 == "string" || arg1 instanceof Function) {
                    // 是类型方式
                    BindManager_1.bindManager.bindResponse(mediator, arg1, arg2, mediator[propertyKey]);
                }
                else {
                    // 是字典方式
                    for (var type in arg1) {
                        BindManager_1.bindManager.bindResponse(mediator, type, arg1[type], mediator[propertyKey]);
                    }
                }
            });
        };
    }
    exports.BindResponse = BindResponse;
    /**
     * @private
     */
    function BindModuleResponse(arg1, arg2) {
        return function (prototype, propertyKey) {
            listenOnOpen(prototype, propertyKey, function (mediator) {
                if (typeof arg1 == "string" || arg1 instanceof Function) {
                    // 是类型方式
                    BindManager_1.bindManager.bindResponse(mediator, arg1, arg2, mediator[propertyKey], mediator.observable);
                }
                else {
                    // 是字典方式
                    for (var type in arg1) {
                        BindManager_1.bindManager.bindResponse(mediator, type, arg1[type], mediator[propertyKey], mediator.observable);
                    }
                }
            });
        };
    }
    exports.BindModuleResponse = BindModuleResponse;
});
//# sourceMappingURL=Injector.js.map