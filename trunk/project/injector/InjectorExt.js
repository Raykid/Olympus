import { decorateThis } from '../../kernel/global/Patch';
import * as BindUtil from "../../kernel/injector/BindUtil";
import { addSubHandler, isComponent, listenOnOpen, searchUIDepth } from '../../kernel/injector/Injector';
import Message from '../../kernel/observable/Message';
import { listenConstruct, listenDispose, wrapConstruct } from "../../utils/ConstructUtil";
import { bridgeManager } from "../bridge/BridgeManager";
import { core } from '../core/Core';
import { registerModule } from "../mediator/Mediator";
import { netManager } from "../net/NetManager";
import ResponseData from "../net/ResponseData";
import { compileMessage, compileResponse } from './BindUtilExt';
/** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
export function Injectable() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (this === decorateThis) {
        // 不需要转换注册类型，直接注册
        core.mapInject(args[0]);
    }
    else {
        // 需要转换注册类型，需要返回一个ClassDecorator
        return function (realCls) {
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var cls = args_1[_i];
                // 注入类型
                core.mapInject(realCls, cls);
            }
            // 需要转换的也要额外将自身注入一个
            core.mapInject(realCls);
        };
    }
}
;
export function Inject(target, key) {
    if (key) {
        var cls = Reflect.getMetadata("design:type", target, key);
        doInject(target.constructor, key, cls);
    }
    else {
        return function (prototype, propertyKey) {
            doInject(prototype.constructor, propertyKey, target);
        };
    }
}
;
function doInject(cls, key, type) {
    // 监听实例化
    var target;
    listenConstruct(cls, function (instance) {
        Object.defineProperty(instance, key, {
            configurable: true,
            enumerable: true,
            get: function () { return target || (target = core.getInject(type)); }
        });
    });
}
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
            // 替换skin属性
            var $skin;
            var oriSkin = instance.skin;
            Object.defineProperty(instance, "skin", {
                configurable: true,
                enumerable: true,
                get: function () {
                    return $skin;
                },
                set: function (value) {
                    if (value === $skin)
                        return;
                    var lastBridge = this.bridge;
                    // 根据skin类型选取表现层桥
                    this.bridge = bridgeManager.getBridgeBySkin(value);
                    // 记录值
                    if (this.bridge) {
                        if (this.bridge === lastBridge && $skin) {
                            // 需要判断桥的类型是否相同，且之前有皮肤，则替换皮肤
                            $skin = this.bridge.replaceSkin(this, $skin, value);
                        }
                        else {
                            // 否则直接包装一下皮肤
                            $skin = this.bridge.wrapSkin(this, value);
                        }
                    }
                    else {
                        // 不认识的皮肤类型，直接赋值
                        $skin = value;
                    }
                }
            });
            // 如果本来就有皮肤，则赋值皮肤
            if (oriSkin)
                instance.skin = oriSkin;
        });
        // 包装类
        var wrapperCls = wrapConstruct(cls);
        // 注册模块，每一个Mediator都有成为独立Module的能力
        registerModule(moduleName, wrapperCls);
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
        if (isComponent(instance) && instance.parent) {
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
        if (isComponent(instance) && instance.parent) {
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
function doBindMessage(comp, target, type, uiDict, observable) {
    searchUIDepth(uiDict, comp, target, function (currentTarget, target, name, exp) {
        BindUtil.pushCompileCommand(currentTarget, target, compileMessage, type, name, exp, observable);
    });
}
/**
 * @private
 */
export function BindMessage(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, function (comp) {
            var target = comp[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindMessage(comp, target, arg1, arg2, comp.observable);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindMessage(comp, target, type, arg1[type], comp.observable);
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
        listenOnOpen(prototype, function (comp) {
            var target = comp[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindMessage(comp, target, arg1, arg2);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindMessage(comp, target, type, arg1[type]);
                }
            }
        });
    };
}
function doBindResponse(comp, target, type, uiDict, observable) {
    searchUIDepth(uiDict, comp, target, function (currentTarget, target, name, exp) {
        BindUtil.pushCompileCommand(currentTarget, target, compileResponse, type, name, exp, observable);
    });
}
/**
 * @private
 */
export function BindResponse(arg1, arg2) {
    return function (prototype, propertyKey) {
        // Response需要在onOpen之后执行，因为可能有初始化消息需要绑定，要在onOpen后有了viewModel再首次更新显示
        listenOnOpen(prototype, function (comp) {
            var target = comp[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindResponse(comp, target, arg1, arg2, comp.observable);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindResponse(comp, target, type, arg1[type], comp.observable);
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
        listenOnOpen(prototype, function (comp) {
            var target = comp[propertyKey];
            if (typeof arg1 == "string" || arg1 instanceof Function) {
                // 是类型方式
                doBindResponse(comp, target, arg1, arg2);
            }
            else {
                // 是字典方式
                for (var type in arg1) {
                    doBindResponse(comp, target, type, arg1[type]);
                }
            }
        });
    };
}
