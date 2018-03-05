import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import Message from "../../core/message/Message";
import { wrapConstruct, listenConstruct, listenDispose } from "../../utils/ConstructUtil";
import ResponseData from "../net/ResponseData";
import { netManager } from "../net/NetManager";
import { bridgeManager } from "../bridge/BridgeManager";
import Mediator from "../mediator/Mediator";
import { moduleManager } from "../module/ModuleManager";
import { decorateThis } from "../../core/global/Patch";
import Dictionary from "../../utils/Dictionary";
import * as BindUtil from "./BindUtil";
import { searchUI } from "./BindUtil";
import "reflect-metadata";
import MediatorStatus from "../mediator/MediatorStatus";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 *
 * 负责注入的模块
*/
/** 定义数据模型，支持实例注入，并且自身也会被注入 */
export function ModelClass() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // 转调Injectable方法
    if (this === decorateThis) {
        var cls = wrapConstruct(args[0]);
        Injectable.call(this, cls);
        return cls;
    }
    else {
        var result = Injectable.apply(this, args);
        return function (realCls) {
            realCls = wrapConstruct(realCls);
            result.call(this, realCls);
            return realCls;
        };
    }
}
/** 定义界面中介者，支持实例注入，并可根据所赋显示对象自动调整所使用的表现层桥 */
export function MediatorClass(moduleName) {
    return function (cls) {
        // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
        if (!cls.prototype.dispose)
            console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
        // 监听实例化
        listenConstruct(cls, function (instance) {
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
                    this.bridge = bridgeManager.getBridgeBySkin(value);
                }
            });
        });
        // 包装类
        var wrapperCls = wrapConstruct(cls);
        // 注册模块，每一个Mediator都有成为独立Module的能力
        moduleManager.registerModule(wrapperCls);
        // 返回包装类
        return wrapperCls;
    };
}
export function MessageHandler(target, key) {
    if (key) {
        var defs = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass = defs[0];
        if (!(resClass.prototype instanceof Message))
            throw new Error("@MessageHandler装饰器装饰的方法的首个参数必须是Message");
        doMessageHandler(target.constructor, key, resClass, true);
    }
    else {
        return function (prototype, propertyKey, descriptor) {
            doMessageHandler(prototype.constructor, propertyKey, target, true);
        };
    }
}
;
export function GlobalMessageHandler(target, key) {
    if (key) {
        var defs = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass = defs[0];
        if (!(resClass.prototype instanceof Message))
            throw new Error("@GlobalMessageHandler装饰器装饰的方法的首个参数必须是Message");
        doMessageHandler(target.constructor, key, resClass, false);
    }
    else {
        return function (prototype, propertyKey, descriptor) {
            doMessageHandler(prototype.constructor, propertyKey, target, false);
        };
    }
}
;
function doMessageHandler(cls, key, type, inModule) {
    // 监听实例化
    listenConstruct(cls, function (instance) {
        if (instance instanceof Mediator && instance.parent) {
            // 如果是被托管的Mediator，则需要等到被托管后再执行注册
            addSubHandler(instance, function () {
                var observable = inModule ? instance.observable || core.observable : core.observable;
                observable.listen(type, instance[key], instance);
            });
        }
        else {
            var observable = inModule ? instance.observable || core.observable : core.observable;
            observable.listen(type, instance[key], instance);
        }
    });
    // 监听销毁
    listenDispose(cls, function (instance) {
        var observable = inModule ? instance.observable || core.observable : core.observable;
        observable.unlisten(type, instance[key], instance);
    });
}
export function ResponseHandler(target, key) {
    if (key) {
        var defs = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass = defs[0];
        if (!(resClass.prototype instanceof ResponseData))
            throw new Error("无参数@ResponseHandler装饰器装饰的方法的首个参数必须是ResponseData");
        doResponseHandler(target.constructor, key, defs[0], true);
    }
    else {
        return function (prototype, propertyKey, descriptor) {
            doResponseHandler(prototype.constructor, propertyKey, target, true);
        };
    }
}
export function GlobalResponseHandler(target, key) {
    if (key) {
        var defs = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass = defs[0];
        if (!(resClass.prototype instanceof ResponseData))
            throw new Error("无参数@GlobalResponseHandler装饰器装饰的方法的首个参数必须是ResponseData");
        doResponseHandler(target.constructor, key, defs[0], false);
    }
    else {
        return function (prototype, propertyKey, descriptor) {
            doResponseHandler(prototype.constructor, propertyKey, target, false);
        };
    }
}
function doResponseHandler(cls, key, type, inModule) {
    // 监听实例化
    listenConstruct(cls, function (instance) {
        if (instance instanceof Mediator && instance.parent) {
            // 如果是被托管的Mediator，则需要等到被托管后再执行注册
            addSubHandler(instance, function () {
                netManager.listenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
            });
        }
        else {
            netManager.listenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
        }
    });
    // 监听销毁
    listenDispose(cls, function (instance) {
        netManager.unlistenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
    });
}
var subHandlerDict = new Dictionary();
function addSubHandler(instance, handler) {
    if (!instance)
        return;
    var handlers = subHandlerDict.get(instance);
    if (!handlers)
        subHandlerDict.set(instance, handlers = []);
    if (handlers.indexOf(handler) < 0)
        handlers.push(handler);
}
/** 添加子Mediator */
export function SubMediator(prototype, propertyKey) {
    if (prototype.delegateMediator instanceof Function && prototype.undelegateMediator instanceof Function) {
        // 监听实例化
        listenConstruct(prototype.constructor, function (instance) {
            var mediator = instance[propertyKey];
            // 篡改属性
            Object.defineProperty(instance, propertyKey, {
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
                        // 如果当前中介者已经为正在打开或已打开状态，则额外调用open
                        if (this.status === MediatorStatus.OPENING || this.status === MediatorStatus.OPENED) {
                            mediator.open(this.data);
                        }
                    }
                }
            });
            // 实例化
            if (mediator === undefined) {
                var cls = Reflect.getMetadata("design:type", prototype, propertyKey);
                instance[propertyKey] = new cls();
            }
            // 执行回调
            var handlers = subHandlerDict.get(mediator);
            if (handlers) {
                for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                    var handler = handlers_1[_i];
                    handler(mediator);
                }
                // 移除记录
                subHandlerDict.delete(mediator);
            }
        });
        // 监听销毁
        listenDispose(prototype.constructor, function (instance) {
            var mediator = instance[propertyKey];
            if (mediator) {
                // 移除实例
                instance[propertyKey] = undefined;
            }
        });
    }
}
var onOpenDict = new Dictionary();
function listenOnOpen(prototype, propertyKey, before, after) {
    listenConstruct(prototype.constructor, function (mediator) {
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
            // 递减篡改次数
            var count = onOpenDict.get(mediator) - 1;
            onOpenDict.set(mediator, count);
            // 判断是否所有onOpen都调用完毕，如果完毕了，则启动编译过程
            if (count <= 0) {
                // 移除数据
                onOpenDict.delete(mediator);
                // 全调用完毕了，按层级顺序由浅入深编译
                var bindTargets = mediator.bindTargets;
                for (var depth in bindTargets) {
                    var dict = bindTargets[depth];
                    dict.forEach(function (currentTarget) { return BindUtil.compile(mediator, currentTarget); });
                }
            }
        };
        // 记录onOpen篡改次数
        var count = onOpenDict.get(mediator) || 0;
        onOpenDict.set(mediator, count + 1);
    });
}
/**
 * 获取显示对象在mediator.skin中的嵌套层级
 *
 * @param {IMediator} mediator 中介者
 * @param {*} target 目标显示对象
 * @returns {number}
 */
function getDepth(mediator, target) {
    var skin = mediator.skin;
    var bridge = mediator.bridge;
    var depth = 0;
    if (bridge.isMySkin(target)) {
        while (target && target !== skin) {
            depth++;
            target = bridge.getParent(target);
        }
        // 如果显示对象是没有根的，或者不在skin的显示树中，则返回0
        if (!target)
            depth = 0;
    }
    return depth;
}
function searchUIDepth(values, mediator, target, callback, addressing) {
    if (addressing === void 0) { addressing = false; }
    // 获取显示层级
    var depth = getDepth(mediator, target);
    // 如果有中断编译则将遍历的工作推迟到中断重启后，否则直接开始遍历
    var stopLeftHandlers = target.__stop_left_handlers__;
    if (stopLeftHandlers)
        stopLeftHandlers.push(handler);
    else
        handler(target, mediator.bindTargets, stopLeftHandlers);
    function handler(target, bindTargets, leftHandlers) {
        var index = -1;
        if (leftHandlers)
            index = leftHandlers.indexOf(handler);
        // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
        searchUI(values, target, function (currentTarget, name, exp, depth) {
            if (addressing)
                currentTarget = currentTarget[name];
            // 记录当前编译目标和命令本体目标到bindTargets中
            var dict = bindTargets[depth];
            if (!dict)
                bindTargets[depth] = dict = new Dictionary();
            dict.set(currentTarget, target);
            // 调用回调
            callback(currentTarget, target, name, exp, leftHandlers, index);
        }, depth);
    }
}
/**
 * @private
 */
export function BindValue(arg1, arg2) {
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
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target = mediator[propertyKey];
            searchUIDepth(uiDict, mediator, target, function (currentTarget, target, name, exp) {
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileValue, name, exp);
            });
        });
    };
}
/**
 * @private
 */
export function BindExp(exp) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            // 组织参数字典
            var uiDict = {};
            if (exp instanceof Array) {
                for (var key in exp) {
                    uiDict[key] = exp[key];
                }
            }
            else {
                uiDict[""] = exp;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target = mediator[propertyKey];
            searchUIDepth(uiDict, mediator, target, function (currentTarget, target, name, exp) {
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileExp, exp);
            });
        });
    };
}
/**
 * @private
 */
export function BindFunc(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            // 组织参数字典
            var funcDict;
            if (typeof arg1 == "string") {
                funcDict = {};
                funcDict[arg1] = arg2;
            }
            else {
                funcDict = arg1;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target = mediator[propertyKey];
            searchUIDepth(funcDict, mediator, target, function (currentTarget, target, name, argExps) {
                // 统一参数类型为字符串数组
                if (!(argExps instanceof Array))
                    argExps = [argExps];
                // 添加编译指令
                BindUtil.pushCompileCommand.apply(BindUtil, [currentTarget, target, BindUtil.compileFunc, name].concat(argExps));
            });
        });
    };
}
/**
 * @private
 */
export function BindOn(arg1, arg2, arg3) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            // 获取编译启动目标
            var target = mediator[propertyKey];
            // 组织参数字典
            if (typeof arg1 == "string") {
                if (arg3) {
                    // 指定了UI对象，先去寻找
                    var nameDict = {};
                    nameDict[arg1] = "";
                    searchUIDepth(nameDict, mediator, target, function (currentTarget, target, type, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, arg2, arg3);
                    }, true);
                }
                else {
                    var evtDict = {};
                    evtDict[arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(evtDict, mediator, target, function (currentTarget, target, type, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, type, exp);
                    });
                }
            }
            else {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, mediator, target, function (currentTarget, target, type, exp) {
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, type, exp);
                });
            }
        });
    };
}
/**
 * @private
 */
export function BindIf(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            var target = mediator[propertyKey];
            if (typeof arg1 === "string" || arg1 instanceof Function) {
                if (!arg2) {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({ r: 13 }, mediator, target, function (currentTarget, target, name, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, arg1);
                    });
                }
                else {
                    // 指定了寻址路径，需要寻址
                    var uiDict = {};
                    uiDict[arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, mediator, target, function (currentTarget, target, name, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, exp);
                    }, true);
                }
            }
            else {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, mediator, target, function (currentTarget, target, name, exp) {
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, exp);
                }, true);
            }
        });
    };
}
/**
 * @private
 */
export function BindFor(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            // 取到编译目标对象
            var target = mediator[propertyKey];
            // 开始赋值指令
            if (typeof arg1 == "string") {
                if (!arg2) {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({ r: 13 }, mediator, target, function (currentTarget, target, name, exp, leftHandlers, index) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, arg1);
                        // 设置中断编译
                        currentTarget.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    });
                }
                else {
                    // 指定了寻址路径，需要寻址
                    var uiDict = {};
                    uiDict[arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, mediator, target, function (currentTarget, target, name, exp, leftHandlers, index) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, exp);
                        // 设置中断编译
                        currentTarget.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    }, true);
                }
            }
            else {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, mediator, target, function (currentTarget, target, name, exp, leftHandlers, index) {
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, exp);
                    // 设置中断编译
                    currentTarget.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                }, true);
            }
        });
    };
}
function doBindMessage(mediator, target, type, uiDict, observable) {
    searchUIDepth(uiDict, mediator, target, function (currentTarget, target, name, exp) {
        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileMessage, type, name, exp, observable);
    });
}
/**
 * @private
 */
export function BindMessage(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            var target = mediator[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindMessage(mediator, target, arg1, arg2, mediator.observable);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindMessage(mediator, target, type, arg1[type], mediator.observable);
                }
            }
        });
    };
}
/**
 * @private
 */
export function BindGlobalMessage(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            var target = mediator[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindMessage(mediator, target, arg1, arg2);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindMessage(mediator, target, type, arg1[type]);
                }
            }
        });
    };
}
function doBindResponse(mediator, target, type, uiDict, observable) {
    searchUIDepth(uiDict, mediator, target, function (currentTarget, target, name, exp) {
        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileResponse, type, name, exp, observable);
    });
}
/**
 * @private
 */
export function BindResponse(arg1, arg2) {
    return function (prototype, propertyKey) {
        // Response需要在onOpen之后执行，因为可能有初始化消息需要绑定，要在onOpen后有了viewModel再首次更新显示
        listenOnOpen(prototype, propertyKey, function (mediator) {
            var target = mediator[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindResponse(mediator, target, arg1, arg2, mediator.observable);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindResponse(mediator, target, type, arg1[type], mediator.observable);
                }
            }
        });
    };
}
/**
 * @private
 */
export function BindGlobalResponse(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, propertyKey, function (mediator) {
            var target = mediator[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindResponse(mediator, target, arg1, arg2);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindResponse(mediator, target, type, arg1[type]);
                }
            }
        });
    };
}
