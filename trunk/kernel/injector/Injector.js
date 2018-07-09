import "reflect-metadata";
import { listenApply, listenConstruct, listenDispose } from "../../utils/ConstructUtil";
import Dictionary from "../../utils/Dictionary";
import { replaceDisplay } from "../../utils/DisplayUtil";
import { evalExp } from '../bind/Utils';
import ComponentStatus from '../enums/ComponentStatus';
import { decorateThis } from '../global/Patch';
import * as BindUtil from "./BindUtil";
import { searchUI } from "./BindUtil";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 *
 * 负责注入的模块
*/
var subHandlerDict = new Dictionary();
export function addSubHandler(instance, handler) {
    if (!instance)
        return;
    var handlers = subHandlerDict.get(instance);
    if (!handlers)
        subHandlerDict.set(instance, handlers = []);
    if (handlers.indexOf(handler) < 0)
        handlers.push(handler);
}
export function isComponent(target) {
    return (target.delegate instanceof Function && target.undelegate instanceof Function);
}
export function SubComponent(arg1, arg2, arg3) {
    var oriSkin;
    var compCls;
    var dataExp;
    // 判断是否是参数化装饰
    if (this === decorateThis) {
        // 无参数
        doSubComponent(arg1, arg2);
    }
    else {
        // 有参数，分配参数
        if (typeof arg1 === "string" && !arg2 && !arg3) {
            dataExp = arg1;
        }
        else if (arg1 instanceof Function) {
            compCls = arg1;
            dataExp = arg2;
        }
        else {
            oriSkin = arg1;
            compCls = arg2;
            dataExp = arg3;
        }
        // 返回装饰器方法
        return doSubComponent;
    }
    function doSubComponent(prototype, propertyKey) {
        if (isComponent(prototype)) {
            // 监听实例化
            listenConstruct(prototype.constructor, function (instance) {
                var skin = oriSkin;
                var declaredCls = Reflect.getMetadata("design:type", prototype, propertyKey);
                var declaredComponentCls;
                if (isComponent(declaredCls.prototype))
                    declaredComponentCls = declaredCls;
                var comp;
                var temp = instance[propertyKey];
                // 篡改属性
                Object.defineProperty(instance, propertyKey, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        // 如果类型声明为Component，则返回Component，否则返回皮肤本身
                        return (declaredComponentCls ? comp : skin);
                    },
                    set: function (value) {
                        var _this = this;
                        if (isComponent(value)) {
                            // 取消托管中介者
                            if (comp) {
                                this.undelegate(comp);
                            }
                            // 设置中介者
                            comp = value;
                            // 托管新的中介者
                            if (comp) {
                                // 如果当前中介者没有皮肤就用装饰器皮肤
                                if (skin && !comp.skin)
                                    comp.skin = skin;
                            }
                        }
                        else if (value) {
                            // 赋值皮肤
                            skin = value;
                            // 如果存在中介者，则额外赋值中介者皮肤
                            if (comp) {
                                if (comp.skin && comp.status < ComponentStatus.OPENED) {
                                    // 当前有皮肤且中介者尚未打开完毕，说明是现在是皮肤转发阶段，要用老皮肤替换新皮肤的位置
                                    replaceDisplay(comp.bridge, value, comp.skin);
                                    // 同步位置
                                    comp.bridge.syncSkin(value, comp.skin);
                                }
                                else {
                                    // 当前没皮肤，或者中介者已经打开完毕了，说明新皮肤就是要替换老皮肤
                                    comp.skin = value;
                                }
                            }
                        }
                        else {
                            // comp和skin都赋值为空
                            skin = value;
                            if (comp) {
                                comp.skin = value;
                            }
                            comp = value;
                        }
                        // 如果当前中介者已经为正在打开或已打开状态，则额外调用open
                        if (comp) {
                            // 托管中介者
                            this.delegate(comp);
                            // 如果当前中介者已经为正在打开或已打开状态，则额外调用open
                            if (comp.skin) {
                                if (comp.status === ComponentStatus.UNOPEN) {
                                    var getCommonScope = function () {
                                        return {
                                            $this: _this,
                                            $data: _this.viewModel,
                                            $bridge: _this.bridge,
                                            $currentTarget: comp,
                                            $target: comp
                                        };
                                    };
                                    // 子Component还没有open，open之
                                    if (this.status === ComponentStatus.OPENED) {
                                        // 父Component已经open了，直接open之
                                        var data = dataExp ? evalExp(dataExp, this.viewModel, this.viewModel, this.data, getCommonScope()) : this.data;
                                        if (!data)
                                            data = this.data;
                                        // 执行open方法
                                        comp.open(data);
                                    }
                                    else if (this.status < ComponentStatus.OPENED && dataExp) {
                                        // 父Component也没有open，监听子Component的open，篡改参数
                                        listenApply(comp, "open", function () {
                                            var data = evalExp(dataExp, _this.viewModel, _this.viewModel, _this.data, getCommonScope());
                                            if (data)
                                                return [data];
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
                // 实例化
                if (temp) {
                    instance[propertyKey] = temp;
                }
                else if (temp === undefined) {
                    // 优先使用是中介者类的元数据类型，其次使用装饰器提供的中介者类型
                    var cls = declaredComponentCls || compCls;
                    if (!cls)
                        throw new Error("必须在类型声明或装饰器中至少一处提供Component的类型");
                    instance[propertyKey] = temp = new cls(skin);
                }
                // 执行回调
                var handlers = subHandlerDict.get(comp);
                if (handlers) {
                    for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                        var handler = handlers_1[_i];
                        handler(comp);
                    }
                    // 移除记录
                    subHandlerDict.delete(comp);
                }
            });
            // 监听销毁
            listenDispose(prototype.constructor, function (instance) {
                var comp = instance[propertyKey];
                if (comp) {
                    // 移除实例
                    instance[propertyKey] = undefined;
                }
            });
        }
    }
}
var onOpenDict = new Dictionary();
export function listenOnOpen(prototype, before, after) {
    listenApply(prototype.constructor, "onOpen", function (comp) {
        // 记录onOpen篡改次数
        var count = onOpenDict.get(comp) || 0;
        onOpenDict.set(comp, count + 1);
        // 调用回调
        before && before(comp);
    }, function (comp) {
        // 调用回调
        after && after(comp);
        // 递减篡改次数
        var count = onOpenDict.get(comp) - 1;
        onOpenDict.set(comp, count);
        // 判断是否所有onOpen都调用完毕，如果完毕了，则启动编译过程
        if (count <= 0) {
            // 移除数据
            onOpenDict.delete(comp);
            // 全调用完毕了，按层级顺序由浅入深编译
            var bindTargets = comp.bindTargets;
            for (var depth in bindTargets) {
                var dict = bindTargets[depth];
                dict.forEach(function (currentTarget) { return BindUtil.compile(comp, currentTarget); });
            }
        }
    });
}
/**
 * 获取显示对象在comp.skin中的嵌套层级
 *
 * @param {IComponent} comp 中介者
 * @param {*} target 目标显示对象
 * @returns {number}
 */
export function getDepth(comp, target) {
    var skin = comp.skin;
    var bridge = comp.bridge;
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
export function searchUIDepth(values, comp, target, callback, addressing) {
    if (addressing === void 0) { addressing = false; }
    // 获取显示层级
    var depth = getDepth(comp, target);
    // 如果有中断编译则将遍历的工作推迟到中断重启后，否则直接开始遍历
    var stopLeftHandlers = target.__stop_left_handlers__;
    if (stopLeftHandlers)
        stopLeftHandlers.push(handler);
    else
        handler(target, comp.bindTargets, stopLeftHandlers);
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
        listenOnOpen(prototype, function (comp) {
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
            var target = comp[propertyKey];
            searchUIDepth(uiDict, comp, target, function (currentTarget, target, name, exp) {
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
        listenOnOpen(prototype, function (comp) {
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
            var target = comp[propertyKey];
            searchUIDepth(uiDict, comp, target, function (currentTarget, target, name, exp) {
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
        listenOnOpen(prototype, function (comp) {
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
            var target = comp[propertyKey];
            searchUIDepth(funcDict, comp, target, function (currentTarget, target, name, argExps) {
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
        listenOnOpen(prototype, function (comp) {
            // 获取编译启动目标
            var target = comp[propertyKey];
            // 组织参数字典
            if (typeof arg1 == "string") {
                if (arg3) {
                    // 指定了UI对象，先去寻找
                    var nameDict = {};
                    nameDict[arg1] = "";
                    searchUIDepth(nameDict, comp, target, function (currentTarget, target, type, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, arg2, arg3);
                    }, true);
                }
                else {
                    var evtDict = {};
                    evtDict[arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(evtDict, comp, target, function (currentTarget, target, type, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, type, exp);
                    });
                }
            }
            else {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, comp, target, function (currentTarget, target, type, exp) {
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
        listenOnOpen(prototype, function (comp) {
            var target = comp[propertyKey];
            if (typeof arg1 === "string" || arg1 instanceof Function) {
                if (!arg2) {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({ r: 13 }, comp, target, function (currentTarget, target, name, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, arg1);
                    });
                }
                else {
                    // 指定了寻址路径，需要寻址
                    var uiDict = {};
                    uiDict[arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, comp, target, function (currentTarget, target, name, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, exp);
                    }, true);
                }
            }
            else {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, comp, target, function (currentTarget, target, name, exp) {
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
export function BindFor(arg1, arg2, arg3, arg4) {
    // 组织参数
    var uiDict;
    var name;
    var exp;
    var compCls;
    var dataExp;
    if (typeof arg1 === "string") {
        if (typeof arg2 === "string") {
            name = arg1;
            exp = arg2;
            compCls = arg3;
            dataExp = arg4;
        }
        else {
            exp = arg1;
            compCls = arg2;
            dataExp = arg3;
        }
    }
    else {
        uiDict = arg1;
    }
    return function (prototype, propertyKey) {
        var declaredCls = Reflect.getMetadata("design:type", prototype, propertyKey);
        var declaredComponentCls;
        if (isComponent(declaredCls.prototype))
            declaredComponentCls = declaredCls;
        listenOnOpen(prototype, function (comp) {
            // 取到编译目标对象
            var target = comp[propertyKey];
            // 开始赋值指令
            if (!uiDict) {
                if (!name) {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({ r: 13 }, comp, target, function (currentTarget, target, _name, _exp, leftHandlers, index) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, exp, compCls, declaredComponentCls, dataExp);
                        // 设置中断编译
                        target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    });
                }
                else {
                    // 指定了寻址路径，需要寻址
                    var uiDict = {};
                    uiDict[name] = exp;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, comp, target, function (currentTarget, target, _name, _exp, leftHandlers, index) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, _exp, compCls, declaredComponentCls, dataExp);
                        // 设置中断编译
                        target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    }, true);
                }
            }
            else {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(uiDict, comp, target, function (currentTarget, target, _name, _exp, leftHandlers, index) {
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, _exp, compCls, declaredComponentCls, dataExp);
                    // 设置中断编译
                    target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                }, true);
            }
        });
    };
}
